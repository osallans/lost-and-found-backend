import { Router } from 'express';
import SubcategoryController from '../controllers/subcategory.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/role.middleware';

const router = Router();

router.post('/subcategories', authenticate, authorize('admin'), SubcategoryController.create);
router.get('/subcategories/:id', authenticate, SubcategoryController.getById);
router.put('/subcategories/:id', authenticate, authorize('admin'), SubcategoryController.update);
router.delete('/subcategories/:id', authenticate, authorize('admin'), SubcategoryController.delete);

export default router;
