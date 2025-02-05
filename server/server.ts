/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import jwt from 'jsonwebtoken';
import { authMiddleware, ClientError, errorMiddleware } from './lib/index.js';
import argon2 from 'argon2';
import { nextTick } from 'process';
import { uploadsMiddleware } from './lib/uploads-middleware.js';

type User = {
  userId: number;
  username: string;
  hashedPassword: string;
};

type Trips = {
  tripId: number;
  userId: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
};

type Photos = {
  photoId: number;
  photoUrl: string;
  tripId: number;
  caption: string;
};

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const hashKey = process.env.TOKEN_SECRET;
if (!hashKey) throw new Error('TOKEN_SECRET not found in .env');

const app = express();

// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

// api to sign up
app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ClientError(400, 'username and password are required fields');
    }

    const hashedPassword = await argon2.hash(password); // Correctly hash the password

    const sql = `
      insert into "Users" ("username", "hashedPassword")
      values ($1, $2)
      returning "userId", "username", "createdAt";
    `;
    const result = await db.query<User>(sql, [username, hashedPassword]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// api to sign-in
app.post('/api/auth/sign-in', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ClientError(400, 'invalid login');
    }

    const sql = `
    select "userId", "hashedPassword"
    from "Users"
    where "username" =$1;
    `;
    console.log('Executing SQL query:', sql);
    console.log('With parameters:', [username]);

    const result = await db.query<User>(sql, [username]);
    const user = result.rows[0];
    if (!user) {
      throw new ClientError(400, 'invalid login');
    }
    const { userId, hashedPassword } = user;
    console.log('Hashed password from database:', hashedPassword); // Log the password hash
    const isPasswordValid = await argon2.verify(hashedPassword, password);
    if (!isPasswordValid) throw new ClientError(401, 'invalid login');

    const payload = { userId, username };
    const token = jwt.sign(payload, hashKey, { expiresIn: '1h' }); // expiration for login
    res.status(200).json({ user: { userId, username }, token });
  } catch (error) {
    next(error);
  }
});

// api to log out

app.post('/api/auth/sign-out', (req, res, next) => {
  res.status(200).json({ message: 'logged out successfully' });
});

// api to create trip entry backend
app.post('/api/trips', authMiddleware, async (req, res, next) => {
  try {
    const {
      userId,
      title,
      description,
      startDate,
      endDate,
      location,
      lat,
      lng,
    } = req.body;
    if (
      !userId ||
      !title ||
      !location ||
      !lat === undefined ||
      !lng === undefined
    ) {
      throw new ClientError(400, 'required fields are missing');
    }
    if (
      !startDate ||
      !endDate ||
      isNaN(new Date(startDate).getTime()) ||
      isNaN(new Date(endDate).getTime())
    ) {
      throw new ClientError(400, 'Invalid date format');
    }
    console.log('RECEIVED DATA:', req.body);

    const tripSql = `
    insert into "Trips" ("userId", "title", "description", "startDate", "endDate")
    values ($1, $2, $3, $4, $5)
    returning "tripId";
    `; // separate queries to join trips and photo tables
    const tripParams = [userId, title, description, startDate, endDate];
    const tripResult = await db.query<Trips>(tripSql, tripParams);
    const tripId = tripResult.rows[0].tripId;

    const locationSql = `
      INSERT INTO "Locations" ("tripId", "name", "latitude", "longitude")
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const locationParams = [tripId, location, lat.toString(), lng.toString()];
    const locationResult = await db.query(locationSql, locationParams);

    console.log('Executing SQL:', locationSql);
    console.log('With parameters:', locationParams);

    res.status(201).json({
      trip: tripResult.rows[0],

      location: locationResult.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

// api to get multiple photos per trip
app.get('/api/trips', authMiddleware, async (req, res, next) => {
  try {
    const sql = `
      SELECT t.*,
             l."name" AS location,
             l."latitude",
             l."longitude",
             COALESCE(json_agg(p.*) FILTER (WHERE p."photoId" IS NOT NULL), '[]') AS photos
      FROM "Trips" t
      LEFT JOIN "Photos" p ON t."tripId" = p."tripId"
       JOIN "Locations" l ON t."tripId" = l."tripId"
      WHERE t."userId" = $1
      GROUP BY t."tripId", l."name", l."latitude", l."longitude";  -- Include l."name" in GROUP BY
    `;

    const result = await db.query<Trips>(sql, [req.user?.userId]);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// api to get single trip entry backend
app.get('/api/trips/:tripId', authMiddleware, async (req, res, next) => {
  try {
    const { tripId } = req.params;
    if (!Number.isInteger(+tripId)) {
      throw new ClientError(400, 'Invalid tripId');
    }

    const sql = `
      SELECT t.*,
             l."name" AS location,
             l."latitude",
             l."longitude",
             COALESCE(json_agg(p.*) FILTER (WHERE p."photoId" IS NOT NULL), '[]') AS photos
      FROM "Trips" t
      LEFT JOIN "Photos" p ON t."tripId" = p."tripId"
      JOIN "Locations" l ON t."tripId" = l."tripId"
      WHERE t."tripId" = $1 AND t."userId" = $2
      GROUP BY t."tripId", l."name", l."latitude", l."longitude";
    `;

    const params = [tripId, req.user?.userId];
    const result = await db.query(sql, params);
    console.log('trip data from db', result.rows[0]);

    const trip = result.rows[0];
    if (!trip) throw new ClientError(404, 'Entry not found');

    res.json(trip);
  } catch (err) {
    next(err);
  }
});

app.put('/api/trips/:tripId', authMiddleware, async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const { title, description, startDate, endDate } = req.body;
    const sql = `
      update "Trips"
      set "title" = $1, "description" = $2, "startDate" = $3, "endDate" = $4 "location" = $5
      where "tripId" = $6 and "userId" = $7
      returning *;
    `;
    const params = [
      title,
      description,
      startDate,
      endDate,
      tripId,
      req.user?.userId,
    ];
    const result = await db.query(sql, params);
    if (!result.rows.length)
      throw new ClientError(404, 'Trip not found or unauthorized');
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/trips/:tripId', authMiddleware, async (req, res, next) => {
  try {
    const { tripId } = req.params;

    // Delete associated locations first
    const deleteLocationsSql = `
      DELETE FROM "Locations"
      WHERE "tripId" = $1;
    `;
    await db.query(deleteLocationsSql, [tripId]);

    // Delete associated photos next
    const deletePhotosSql = `
      DELETE FROM "Photos"
      WHERE "tripId" = $1;
    `;
    await db.query(deletePhotosSql, [tripId]);

    // Now delete the trip
    const deleteTripSql = `
      DELETE FROM "Trips"
      WHERE "tripId" = $1 AND "userId" = $2
      RETURNING *;
    `;

    const result = await db.query(deleteTripSql, [tripId, req.user?.userId]);
    if (!result.rows.length)
      throw new ClientError(404, 'Trip not found or unauthorized');

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// upload photos
app.post(
  '/api/uploads',
  uploadsMiddleware.array('photos', 10),
  async (req, res, next) => {
    try {
      console.log('Incoming Upload Request:', req.body);
      console.log('Uploaded Files:', req.files);

      if (!req.files || req.files.length === 0) {
        throw new ClientError(400, 'No file field in request');
      }

      const { tripId } = req.body as Partial<Photos>;
      if (!tripId) {
        throw new ClientError(400, 'tripId is a required field');
      }
      const parsedTripId =
        typeof tripId === 'string' ? parseInt(tripId, 10) : tripId;
      if (isNaN(parsedTripId)) {
        throw new ClientError(400, 'Invalid tripId');
      }

      const tripCheckSql = `SELECT "tripId" FROM "Trips" WHERE "tripId" = $1;`;
      const tripCheckResult = await db.query(tripCheckSql, [parsedTripId]);

      if (tripCheckResult.rows.length === 0) {
        throw new ClientError(
          404,
          `Trip with tripId ${parsedTripId} not found`
        );
      }
      const photoPromises = (req.files as Express.Multer.File[]).map(
        async (file, index) => {
          const url = `/images/${file.filename}`;
          const sql = `
          INSERT INTO "Photos" ("tripId", "photoUrl")
          VALUES ($1, $2)
          RETURNING *;
        `;
          const params = [parsedTripId, url];
          const result = await db.query<Photos>(sql, params);
          return result.rows[0];
        }
      );

      const uploadedPhotos = await Promise.all(photoPromises);
      res.status(201).json(uploadedPhotos);
    } catch (err) {
      next(err);
    }
  }
);

// endpoint to add photos to a trip entry
app.post('/api/photos', authMiddleware, async (req, res, next) => {
  try {
    const { tripId, photoUrl } = req.body;

    if (!tripId || !photoUrl) {
      throw new ClientError(400, 'tripId and photoUrl are required');
    }

    const sql = `
      INSERT INTO "Photos" ("tripId", "photoUrl")
      VALUES ($1, $2)
      RETURNING *;
    `;
    const params = [tripId, photoUrl];

    const result = await db.query<Photos>(sql, params);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// get images
app.get('/api/images', async (req, res, next) => {
  try {
    const sql = `
      select *
        from "Photos"
    `;
    const result = await db.query<Photos>(sql);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// API endpoint to get all locations for the user
app.get('/api/trips/locations', authMiddleware, async (req, res, next) => {
  try {
    const sql = `
      SELECT "latitude", "longitude", "name"
      FROM "Locations"
      WHERE "userId" = $1;
    `;
    const result = await db.query(sql, [req.user?.userId]);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

/*
 * Handles paths that aren't handled by any other route handler.
 * It responds with `index.html` to support page refreshes with React Router.
 * This must be the _last_ route, just before errorMiddleware.
 */
app.get('*', (req, res) => res.sendFile(`${reactStaticDir}/index.html`));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log('Listening on port', process.env.PORT);
});
