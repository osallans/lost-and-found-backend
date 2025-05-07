import { Request, Response } from 'express';
import { CreateCountrySchema, UpdateCountrySchema } from '../validators/country.validator';
import { CountryDTO } from '../dtos/country.dto';
import { ICountryController } from '../interfaces/ICountryController';
import { ICountryService } from '../interfaces/ICountryService';
import logger from '../../utils/logger';

export class CountryController implements ICountryController {
  constructor(private readonly countryService: ICountryService) {}

  create = async (req: Request, res: Response): Promise<Response> => {
    const parsed = CreateCountrySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.format() });
    }

    try {
      const newCountry = await this.countryService.create(parsed.data as CountryDTO);
      return res.status(201).json(newCountry);
    } catch (error: any) {
      if (error.code === '23505') {
        return res.status(409).json({ message: 'Country code already exists' });
      }
      logger.error('[CountryController][create]', error);
      return res.status(500).json({ message: 'Error creating country' });
    }
  };

  getAll = async (req: Request, res: Response): Promise<Response> => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;
      const result = await this.countryService.getAllPaginated(page, limit);

      return res.status(200).json({
        ...result,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit),
      });
    } catch (error) {
      logger.error('[CountryController][getAll] Internal Error:', error);
      return res.status(500).json({ message: 'Error fetching countries' });
    }
  };

  getByCode = async (req: Request, res: Response): Promise<Response> => {
    try {
      const country = await this.countryService.getByCode(req.params.code);
      if (!country) return res.status(404).json({ message: 'Country not found' });
      return res.status(200).json(country);
    } catch (error) {
      logger.error('[CountryController][getByCode]', error);
      return res.status(500).json({ message: 'Error fetching country' });
    }
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    const parsed = UpdateCountrySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.format() });
    }

    try {
      const updated = await this.countryService.update(req.params.code, parsed.data);
      if (!updated) return res.status(404).json({ message: 'Country not found' });
      return res.status(200).json(updated);
    } catch (error) {
      logger.error('[CountryController][update]', error);
      return res.status(500).json({ message: 'Error updating country' });
    }
  };

  delete = async (req: Request, res: Response): Promise<Response> => {
    try {
      const deleted = await this.countryService.delete(req.params.code);
      if (!deleted) return res.status(404).json({ message: 'Country not found' });
      return res.status(204).send();
    } catch (error) {
      logger.error('[CountryController][delete]', error);
      return res.status(500).json({ message: 'Error deleting country' });
    }
  };
}
