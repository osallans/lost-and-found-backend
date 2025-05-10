// src/app.ts

import express, { Request, Response } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bodyParser from 'body-parser';
// @ts-ignore
import xss from 'xss-clean';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from 'dotenv';
import pinoHttp from 'pino-http';
import logger from './utils/logger'; // your existing pino logger
// Load environment variables
dotenv.config();

const app = express();

// Security middlewares
//app.use(helmet());
//app.use(xss());
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
import countryRoutes from './country/routes/country.route';
import healthRoutes from './health/routes/health.route';
import { httpLogger } from './middlewares/httpLogger';
import { swaggerDocument } from './docs/swagger';
import authRoutes from './auth/routes/auth.routes';
app.use(cookieParser());




app.use(httpLogger);
app.use(healthRoutes); 
// Use the country routes
app.use('/api', countryRoutes);  // Prefixing with '/api'
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', authRoutes);
// Basic health check route
app.get('/', (req: Request, res: Response) => {
  res.send('Lost and Found API is running 🚀');
});

export default app;
