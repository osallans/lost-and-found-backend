import { ICrudController } from '../interfaces/crudController.interface';
import { createCrudController } from '../factories/crudController.factory';


// Example Controllers
import { CountryController } from '../country/controllers/country.controller';
import { resolveService } from './service.registry';

const controllerRegistry: Record<string, () => ICrudController> = {
  country: () => createCrudController(CountryController, resolveService('country')),
  // Add other controllers here as needed, e.g.:
  // user: () => createCrudController(UserController, resolveService('user')),
};

export function resolveController(entity: string): ICrudController {
  const factory = controllerRegistry[entity.toLowerCase()];
  if (!factory) {
    throw new Error(`Controller not found for entity: ${entity}`);
  }
  return factory();
}
