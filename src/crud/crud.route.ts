import { Router } from 'express';
import { asyncHandler } from '../middlewares/asynchandler';
import { GenericCrudController } from './crud.controller';

export function buildCrudRoutes<T>(controller: GenericCrudController<T>): Router {
  const router = Router();

  router.post('/', asyncHandler(controller.create));
  router.get('/', asyncHandler(controller.getAll));
  router.get('/:id', asyncHandler(controller.getById));
  router.put('/:id', asyncHandler(controller.update));
  router.delete('/:id', asyncHandler(controller.delete));

  return router;
}
