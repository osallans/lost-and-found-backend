import { Router } from 'express';
import { AdminAuthController } from '../controllers/admin.controller';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

/**
 * @route POST /auth/admin-register
 * @desc Register a new Admin
 */
router.post('/admin-register', asyncHandler(AdminAuthController.register));

/**
 * @route POST /auth/admin-login
 * @desc Login Admin (email/password)
 */
router.post('/admin-login', asyncHandler(AdminAuthController.login));

export default router;
