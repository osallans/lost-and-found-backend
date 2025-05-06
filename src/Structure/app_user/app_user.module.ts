import express from 'express';
import appUserRoutes from './routes/app_user.routes';

const appUserModule = express.Router();

appUserModule.use('/api', appUserRoutes);

export default appUserModule;
