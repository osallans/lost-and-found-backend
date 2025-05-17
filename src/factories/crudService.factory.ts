import { ICrudService } from '../interfaces/crudService.interface';

/**
 * Generic factory for creating typed CRUD services.
 * @param ServiceClass - The concrete service class to instantiate.
 * @returns Typed CRUD service instance.
 */
export function createCrudService<T>(ServiceClass: new () => ICrudService<T>): ICrudService<T> {
  return new ServiceClass();
}
