import { Router } from 'express';
import { IdpAuthController } from '../controllers/idpAuth.controller';

const router = Router();

router.get('/discovery', IdpAuthController.discovery);
router.get('/:provider', IdpAuthController.initiateAuth);
router.get('/:provider/callback', IdpAuthController.handleCallback);
router.post('/:provider/verify-token', IdpAuthController.verifyToken);
router.post('/:provider/exchange-code', IdpAuthController.exchangeAuthorizationCode);

export default router;
