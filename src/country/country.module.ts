import express from 'express';
import countryRoutes from './routes/country.route';

const countryModule = express.Router();

countryModule.use('/api', countryRoutes);

export default countryModule;
