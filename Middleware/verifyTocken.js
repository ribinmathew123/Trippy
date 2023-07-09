import jwt from 'jsonwebtoken';

import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET;

export function verifyJwtToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        reject(err);
      }
      resolve(decoded);
    });
  });
}
