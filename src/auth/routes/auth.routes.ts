import { Router } from 'express';

import { IdpAuthController } from '../controllers/idpAuth.controller';
import { AuthController } from '../controllers/auth.controller';

// Create an Express Router instance
const router = Router();


// Define routes and attach controller methods
router.post('/login', AuthController.loginBasic);
router.post('/refresh', AuthController.refreshAccessToken);
router.post('/revoke', AuthController.revokeSession);
router.get('/idp/discovery', IdpAuthController.discovery);
router.get('/idp/:provider', IdpAuthController.initiateAuth);
router.get('/idp/:provider/callback', IdpAuthController.handleCallback);
router.post('/idp/:provider/verify-token', IdpAuthController.verifyToken);
router.post('/idp/:provider/exchange-code', IdpAuthController.exchangeAuthorizationCode);
// Export the router to be used in your main server
export default router;
