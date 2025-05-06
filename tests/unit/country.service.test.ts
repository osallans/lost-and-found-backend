// tests/unit/country.service.test.ts

import { CountryDTO } from '../../src/Structure/country.dto';
import { pool } from '../../src/utils/db';


jest.mock('../../src/utils/db', () => ({
  pool: {
    query: jest.fn(),
  },
}));

describe('CountryService', () => {
  const fakeCountry: CountryDTO = {
    code: 'US',
    name: 'United States',
    name_ar: 'الولايات المتحدة',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should insert and return a country', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [fakeCountry] });

      const result = await CountryService.create(fakeCountry);

      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO country (code, name, name_ar) VALUES ($1, $2, $3) RETURNING *',
        ['US', 'United States', 'الولايات المتحدة']
      );
      expect(result).toEqual(fakeCountry);
    });
  });

  describe('getAllPaginated', () => {
    it('should return paginated countries and total count', async () => {
      const mockRows = [fakeCountry];
      const mockCount = { count: '1' };

      (pool.query as jest.Mock).mockImplementation((query: string) => {
        if (query.includes('SELECT *')) {
          return Promise.resolve({ rows: mockRows });
        } else {
          return Promise.resolve({ rows: [mockCount] });
        }
      });

      const result = await CountryService.getAllPaginated(1, 10);

      expect(result.data).toEqual(mockRows);
      expect(result.total).toBe(1);
    });
  });

  describe('getByCode', () => {
    it('should return a country by code', async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce(
