import { CountryDTO } from '../dtos/country.dto';

export interface ICountryService {
  create(data: CountryDTO): Promise<CountryDTO>;
  getAllPaginated(page: number, limit: number): Promise<{ data: CountryDTO[]; total: number }>
  getByCode(code: string): Promise<CountryDTO | null>;
  update(code: string, data: Partial<CountryDTO>): Promise<CountryDTO | null>;
  delete(code: string): Promise<boolean>;
}
