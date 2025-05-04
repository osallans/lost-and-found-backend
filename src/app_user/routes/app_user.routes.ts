import { Router } from 'express';
import AppUserController from '../controllers/app_user.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/role.middleware';
import { validateUser } from '../../middleware/validation.middleware';

const router = Router();

router.post('/users', authenticate, authorize('admin'), validateUser, AppUserController.create);
router.get('/users/:id', authenticate, AppUserController.getById);
router.put('/users/:id', authenticate, authorize('admin'), AppUserController.update);
router.delete('/users/:id', authenticate, authorize('admin'), AppUserController.delete);

export default router;
