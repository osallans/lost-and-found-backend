import { Request, Response } from 'express';
import CountryService from '../services/country.service';
import { CountryDTO } from '../dtos/country.dto';
import { CreateCountrySchema, UpdateCountrySchema } from '../validators/country.validator';

class CountryController {
  async create(req: Request, res: Response): Promise<Response> {
    const parsed = CreateCountrySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.format() });
    }

    const countryData: CountryDTO = parsed.data;
    try {
      const newCountry = await CountryService.create(countryData);
      return res.status(201).json(newCountry);
    } catch (error: unknown) {
      const err = error as any;
      if (err.code === '23505') {
        return res.status(409).json({ message: 'Country code already exists' });
      }
      console.error('Create error:', err);
      return res.status(500).json({ message: 'Error creating country' });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;
    console.log('Page:', page, 'Limit:', limit);
      const { data, total } = await CountryService.getAllPaginated(page, limit);
      return res.status(200).json({
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        count: data.length,
        data,
      });
    } catch (error) {
      console.error('Get all error:', error);
      return res.status(500).json({ message: 'Error fetching countries' });
    }
  }

  async getByCode(req: Request, res: Response): Promise<Response> {
    const { code } = req.params;
    try {
      const country = await CountryService.getByCode(code);
      if (country) {
        return res.status(200).json(country);
      }
      return res.status(404).json({ message: 'Country not found' });
    } catch (error) {
      console.error('Get by code error:', error);
      return res.status(500).json({ message: 'Error fetching country' });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { code } = req.params;
    const parsed = UpdateCountrySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.format() });
    }

    try {
      const updated = await CountryService.update(code, parsed.data);
      if (updated) {
        return res.status(200).json(updated);
      }
      return res.status(404).json({ message: 'Country not found' });
    } catch (error) {
      console.error('Update error:', error);
      return res.status(500).json({ message: 'Error updating country' });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { code } = req.params;
    try {
      const result = await CountryService.delete(code);
      if (result) {
        return res.status(204).send(); // 204 = No Content (successfully deleted)
      }
      return res.status(404).json({ message: 'Country not found' });
    } catch (error) {
      console.error('Delete error:', error);
      return res.status(500).json({ message: 'Error deleting country' });
    }
  }
}

export default new CountryController();
