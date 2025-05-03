import { Router } from 'express';
import { AuthController } from '../../auth/user/controllers/auth.controller';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

/**
 * @route POST /auth/user-register
 * @desc Register a new User
 */
router.post('/user-register', asyncHandler(AuthController.register));

/**
 * @route POST /auth/user-login-basic
 * @desc Login User (email/password)
 */
router.post('/user-login-basic', asyncHandler(AuthController.loginBasic));

/**
 * @route POST /auth/user-login-idp
 * @desc Login User via IDP (Google, Facebook, etc.)
 */
router.post('/user-login-idp', asyncHandler(AuthController.loginWithIDP));

/**
 * @route POST /auth/user-exchange-code
 * @desc Exchange authorization code for tokens (IDP backend flow)
 */
router.post('/user-exchange-code', asyncHandler(AuthController.exchangeAuthorizationCode));

/**
 * @route POST /auth/user-refresh-token
 * @desc Refresh access token using a refresh token
 */
router.post('/user-refresh-token', asyncHandler(AuthController.refreshAccessToken));

export default router;
