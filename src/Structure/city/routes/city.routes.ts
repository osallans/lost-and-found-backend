import { Router } from 'express';
import CityController from '../controllers/city.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/role.middleware';

const router = Router();

router.post('/cities', authenticate, authorize('admin'), CityController.create);
router.get('/cities/:id', authenticate, CityController.getById);
router.put('/cities/:id', authenticate, authorize('admin'), CityController.update);
router.delete('/cities/:id', authenticate, authorize('admin'), CityController.delete);

export default router;
