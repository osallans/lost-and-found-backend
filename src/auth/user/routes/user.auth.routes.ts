import { Router } from 'express';
import { UserAuthController } from '../controllers/user.auth.controller';
import { asyncHandler } from '../../../utils/asyncHandler';

const router = Router();

/**
 * @route POST /auth/user-register
 * @desc Register a new User
 */
router.post('/user-register', asyncHandler(UserAuthController.register));

/**
 * @route POST /auth/user-login-basic
 * @desc Login User (email/password)
 */
router.post('/user-login-basic', asyncHandler(UserAuthController.loginBasic));

/**
 * @route POST /auth/user-login-idp
 * @desc Login User via IDP (Google, Facebook, etc.)
 */
router.post('/user-login-idp', asyncHandler(UserAuthController.loginWithIDP));

/**
 * @route POST /auth/user-exchange-code
 * @desc Exchange authorization code for tokens (IDP backend flow)
 */
router.post('/user-exchange-code', asyncHandler(UserAuthController.exchangeAuthorizationCode));

/**
 * @route POST /auth/user-refresh-token
 * @desc Refresh access token using a refresh token
 */
router.post('/user-refresh-token', asyncHandler(UserAuthController.refreshAccessToken));

export default router;
