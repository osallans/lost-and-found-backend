import { CountryDTO } from '../dtos/country.dto';
import { ICrudService } from '../../interfaces/crudService.interface';
import { CountryRepository } from '../repositories/country.repository';

export class CountryService implements ICrudService<CountryDTO> {
  private repository: CountryRepository;

  constructor() {
    this.repository = new CountryRepository();
  }

  async getAll(): Promise<CountryDTO[]> {
    return this.repository.getAllPaginated(1, 1000).then(result => result.data);
  }

  async getById(id: string): Promise<CountryDTO | null> {
    return this.repository.getById(id);
  }

  async create(data: CountryDTO): Promise<CountryDTO> {
    return this.repository.create(data);
  }

  async update(id: string, data: Partial<CountryDTO>): Promise<CountryDTO | null> {
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }

  // Optional method for paginated access, not part of ICrudService interface
  async getAllPaginated(page: number, limit: number): Promise<{ data: CountryDTO[]; total: number }> {
    return this.repository.getAllPaginated(page, limit);
  }
}
