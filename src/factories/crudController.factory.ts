import { ICrudController } from '../interfaces/crudController.interface';
import { ICrudService } from '../interfaces/crudService.interface';

/**
 * Generic factory for creating typed CRUD controllers.
 * @param ControllerClass - The concrete controller class to instantiate.
 * @param service - The service instance to inject.
 * @returns Typed CRUD controller instance.
 */
export function createCrudController<T>(
  ControllerClass: new (service: ICrudService<T>) => ICrudController,
  service: ICrudService<T>
): ICrudController {
  return new ControllerClass(service);
}
