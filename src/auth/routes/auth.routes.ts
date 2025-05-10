import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

// Create an Express Router instance
const router = Router();

// Define routes and attach controller methods
router.post('/auth/login', AuthController.loginBasic);
router.post('/auth/refresh', AuthController.refreshAccessToken);
router.post('/auth/revoke', AuthController.revokeSession);

// Export the router to be used in your main server
export default router;
