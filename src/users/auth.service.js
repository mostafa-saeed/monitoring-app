import jsonwebtoken from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import { hash, compare } from 'bcrypt';

const { sign } = jsonwebtoken;

const { JWT_SECRET } = process.env;
const HASH_ROUNDS = 10;

export const generateToken = (payload) => sign(payload, JWT_SECRET);

export const isLoggedIn = expressJwt({
  secret: JWT_SECRET,
  algorithms: ['HS256'],
});

export const hashPassword = (password) => hash(password, HASH_ROUNDS);

export const comparePassword = (password, hashedPassword) => compare(
  password, hashedPassword,
);
