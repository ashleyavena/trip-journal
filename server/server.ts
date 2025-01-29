/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import jwt from 'jsonwebtoken';
import { authMiddleware, ClientError, errorMiddleware } from './lib/index.js';
import argon2 from 'argon2';
import { nextTick } from 'process';

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
  startDate: number;
  endDate: number;
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
    res.status(200).json({ user: { userId, username }, token }); // return generated token to client
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
    const { userId, title, description, startDate, endDate } = req.body;
    if (!userId || !title) {
      throw new ClientError(400, 'title and start date are required fields');
    }
    if (!startDate || !endDate || isNaN(startDate) || isNaN(endDate)) {
      throw new ClientError(400, 'Invalid date format');
    }

    const sql = `
    insert into "Trips" ("userId", "title", "description", "startDate", "endDate")
    values ($1, $2, $3, $4, $5)
    returning *;
    `;
    const params = [userId, title, description, startDate, endDate];
    const result = await db.query<Trips>(sql, params);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// api to get all trip entries backend
app.get('/api/trips', authMiddleware, async (req, res, next) => {
  try {
    const sql = `
      select *
        from "Trips"
        where "userId" = $1;
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
      throw new ClientError(400, 'Invalid entry');
    }
    const sql = `
      select * from "Trips"
      where "tripId" = $1 and "userId"= $2;
    `;
    const params = [tripId, req.user?.userId];
    const result = await db.query(sql, params);
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
      UPDATE "Trips"
      SET "title" = $1, "description" = $2, "startDate" = $3, "endDate" = $4
      WHERE "tripId" = $5 AND "userId" = $6
      RETURNING *;
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
    const sql = `
      DELETE FROM "Trips"
      WHERE "tripId" = $1 AND "userId" = $2
      RETURNING *;
    `;
    const result = await db.query(sql, [tripId, req.user?.userId]);
    if (!result.rows.length)
      throw new ClientError(404, 'Trip not found or unauthorized');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, World!' });
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

// data
