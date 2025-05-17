import { ICrudService } from '../interfaces/crudService.interface';
import { createCrudService } from '../factories/crudService.factory';

// Example Services
import { CountryService } from '../country/services/country.service';
import { CountryDTO } from '../country/dtos/country.dto';

const serviceRegistry: Record<string, () => ICrudService<any>> = {
  country: () => createCrudService<CountryDTO>(CountryService),
  // Add other services here as needed, e.g.:
  // user: () => createCrudService<UserDTO>(UserService),
};

export function resolveService(entity: string): ICrudService<any> {
  const factory = serviceRegistry[entity.toLowerCase()];
  if (!factory) {
    throw new Error(`Service not found for entity: ${entity}`);
  }
  return factory();
}
