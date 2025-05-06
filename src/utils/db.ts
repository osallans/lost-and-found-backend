// src/utils/db.ts
import { Pool } from 'pg'; // Import the Pool class from pg for connection pooling


import dotenv from 'dotenv';
const env = process.env.NODE_ENV || 'development';

// Load .env or .env.test depending on context
dotenv.config({ path: env === 'test' ? '.env.test' : '.env' });


// Create MySQL connection pool
export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'Andela_52',
  database: process.env.DB_DATABASE || 'lost-and-found',
  port: parseInt(process.env.DB_PORT || '5433', 10),
});

