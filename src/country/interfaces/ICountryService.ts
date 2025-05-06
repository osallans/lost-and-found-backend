import { CountryDTO } from '../dtos/country.dto';

export interface ICountryService {
  create(data: CountryDTO): Promise<CountryDTO>;
  getAll(): Promise<CountryDTO[]>;
  getByCode(code: string): Promise<CountryDTO | null>;
  update(code: string, data: Partial<CountryDTO>): Promise<CountryDTO | null>;
  delete(code: string): Promise<boolean>;
}
