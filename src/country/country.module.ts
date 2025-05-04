import express from 'express';
import countryRoutes from './routes/country.routes';

const countryModule = express.Router();

countryModule.use('/api', countryRoutes);

export default countryModule;
