import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import jwt from 'jsonwebtoken';
import { ClientError, errorMiddleware } from './lib/index.js';
import argon2 from 'argon2';

type User = {
  userId: number;
  username: string;
  hashedPassword: string;
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

app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ClientError(400, 'username and password are required fields');
    }

    const hashedPassword = await argon2.hash(password);

    const sql = `
    insert into "users" ("username", "hashedPassword)
    values ($1, $2)
    returning "userId", "username", "createdAt";
    `;
    const result = await db.query<User>(sql, [username, hashedPassword]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// app.post('/api/auth/sign-in', async (req, res, next) => {
//   try {
//   } catch (error) {
//     next(error);
//   }
// });
app.post('/api/auth/sign-in', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ClientError(400, 'invalid login');
    }
    const sql = `
    select "userId", "hashedPassword"
    from "users"
    where "username" =$1;
    `;
    const result = await db.query<User>(sql, [username]);
    const user = result.rows[0];
    if (!user) {
      throw new ClientError(400, 'invalid login');
    }
    const { userId, hashedPassword } = user;
    if (!(await argon2.verify(hashedPassword, password)))
      throw new ClientError(401, 'invalid login');
    const payload = { userId, username };
    const token = jwt.sign(payload, hashKey, { expiresIn: '1h' }); // expiration for login
    res.json({ user: payload, token });
  } catch (error) {
    next(error);
  }
});
app.post('/api/auth/sign-out', (req, res) => {
  res.status(200).json({ message: 'logged out successfully' });
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
