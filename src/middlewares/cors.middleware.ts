import cors from 'cors';

export const corsOptions = {
  origin: 'http://localhost:3000', // Specify your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export const enableCors = cors(corsOptions);
