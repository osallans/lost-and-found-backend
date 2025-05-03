// src/app.ts

import express, { Request, Response } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bodyParser from 'body-parser';
import mysql from 'mysql2/promise';
// @ts-ignore
import xss from 'xss-clean';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

// Security middlewares
app.use(helmet());
app.use(xss());
app.use(cors({ origin: '*' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use(bodyParser.json());

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Lost and Found API',
      version: '1.0.0',
      description: 'API documentation for Lost and Found system',
    },
  },
  apis: ['./src/routes/*.ts'], // We'll fix the routes later
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
import cookieParser from 'cookie-parser';
app.use(cookieParser());
import userAuthRouter from './user/routes/user.auth.routes';
app.use('/auth', userAuthRouter);
// Basic health check route
app.get('/', (req: Request, res: Response) => {
  res.send('Lost and Found API is running 🚀');
});

export default app;
