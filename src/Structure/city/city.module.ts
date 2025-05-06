import express from 'express';
import cityRoutes from './routes/city.routes';

const cityModule = express.Router();

cityModule.use('/api', cityRoutes);

export default cityModule;
