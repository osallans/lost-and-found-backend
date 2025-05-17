// src/services/country.service.ts
import { pool } from '../../utils/db';
import { CountryDTO } from '../dtos/country.dto';
import logger from '../../utils/logger';
import { ICrudService } from '../../interfaces/crudService.interface';
import { ICrudRepository } from '../../interfaces/crudRepository.interface';


export class CountryRepository implements ICrudRepository<CountryDTO> {

  async create(data: CountryDTO): Promise<CountryDTO> {
    const { id, name, name_ar } = data;

    logger.info({ msg: 'Creating country', id, name });

    const query = 'INSERT INTO country (id, name, name_ar) VALUES ($1, $2, $3) RETURNING *';

    try {
      const result = await pool.query(query, [id, name, name_ar]);
      logger.info({ msg: 'Country created', country: result.rows[0] });
      return result.rows[0];
    } catch (error) {
      logger.error({ msg: 'Error creating country', error });
      throw error;
    }
  }

  async getAllPaginated(page: number, limit: number): Promise<{ data: CountryDTO[]; total: number }> {
    const offset = (page - 1) * limit;

    logger.info({ msg: 'Fetching paginated countries', page, limit });

    const dataQuery = `
      SELECT * FROM country
      WHERE is_deleted = FALSE
      ORDER BY name ASC
      LIMIT $1 OFFSET $2
    `;
    const countQuery = `
      SELECT COUNT(*) FROM country
      WHERE is_deleted = FALSE
    `;

    try {
      const [dataResult, countResult] = await Promise.all([
        pool.query(dataQuery, [limit, offset]),
        pool.query(countQuery),
      ]);

      logger.info({ msg: 'Paginated countries fetched', count: dataResult.rowCount });
      return {
        data: dataResult.rows,
        total: parseInt(countResult.rows[0].count, 10),
      };
    } catch (error) {
      logger.error({ msg: 'Error fetching countries', error });
      throw error;
    }
  }

  async getById(id: string): Promise<CountryDTO | null> {
    logger.info({ msg: 'Fetching country by id', id });

    const query = 'SELECT * FROM country WHERE id = $1 AND is_deleted = FALSE';

    try {
      const result = await pool.query(query, [id]);
      const country = result.rows[0] || null;
      logger.info({ msg: country ? 'Country found' : 'Country not found', id });
      return country;
    } catch (error) {
      logger.error({ msg: 'Error fetching country by id', id, error });
      throw error;
    }
  }

  async update(id: string, data: Partial<CountryDTO>): Promise<CountryDTO | null> {
    logger.info({ msg: 'Updating country', id, updates: data });

    const query = 'UPDATE country SET name = $1, name_ar = $2 WHERE id = $3 RETURNING *';

    try {
      const result = await pool.query(query, [data.name, data.name_ar, id]);
      const updated = result.rows[0] || null;
      logger.info({ msg: updated ? 'Country updated' : 'Country not found for update', id });
      return updated;
    } catch (error) {
      logger.error({ msg: 'Error updating country', id, error });
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    logger.info({ msg: 'Soft deleting country', id });

    const query = 'UPDATE country SET is_deleted = TRUE WHERE id = $1';

    try {
      const result = await pool.query(query, [id]);
      const success = result.rowCount! > 0;
      logger.info({ msg: success ? 'Country deleted' : 'Country not found for deletion', id });
      return success;
    } catch (error) {
      logger.error({ msg: 'Error deleting country', id, error });
      throw error;
    }
  }
}

