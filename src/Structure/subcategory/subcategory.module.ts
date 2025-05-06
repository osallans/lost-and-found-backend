import express from 'express';
import subcategoryRoutes from './routes/subcategory.routes';

const subcategoryModule = express.Router();

subcategoryModule.use('/api', subcategoryRoutes);

export default subcategoryModule;
