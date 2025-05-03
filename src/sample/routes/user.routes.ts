import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();
const controller = new UserController();

router.get('/', controller.getAllUsers.bind(controller));
router.get('/:id', controller.getUserById.bind(controller));
router.post('/', controller.createUser.bind(controller));
router.put('/:id', controller.updateUser.bind(controller));
router.delete('/:id', controller.deleteUser.bind(controller));

export default router;