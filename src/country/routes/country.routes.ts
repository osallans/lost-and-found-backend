import { Router } from 'express';
import CountryController from '../controllers/country.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/role.middleware';

const router = Router();

router.post('/countries', authenticate, authorize('admin'), CountryController.create);
router.get('/countries/:code', authenticate, CountryController.getByCode);
router.put('/countries/:code', authenticate, authorize('admin'), CountryController.update);
router.delete('/countries/:code', authenticate, authorize('admin'), CountryController.delete);

export default router;
