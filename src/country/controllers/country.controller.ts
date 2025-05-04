import { Request, Response } from 'express';
import CountryService from '../services/country.service';
import { CountryDTO } from '../dtos/country.dto';

class CountryController {
  async create(req: Request, res: Response) {
    try {
      const countryData: CountryDTO = req.body;
      const newCountry = await CountryService.createCountry(countryData);
      return res.status(201).json(newCountry);
    } catch (error) {
      return res.status(500).json({ message: 'Error creating country', error });
    }
  }

  async getByCode(req: Request, res: Response) {
    const { code } = req.params;
    try {
      const country = await CountryService.getCountryByCode(code);
      if (country) {
        return res.status(200).json(country);
      }
      return res.status(404).json({ message: 'Country not found' });
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching country', error });
    }
  }

  async update(req: Request, res: Response) {
    const { code } = req.params;
    const countryData: Partial<CountryDTO> = req.body;
    try {
      const updatedCountry = await CountryService.updateCountry(code, countryData);
      if (updatedCountry) {
        return res.status(200).json(updatedCountry);
      }
      return res.status(404).json({ message: 'Country not found' });
    } catch (error) {
      return res.status(500).json({ message: 'Error updating country', error });
    }
  }

  async delete(req: Request, res: Response) {
    const { code } = req.params;
    try {
      const isDeleted = await CountryService.deleteCountry(code);
      if (isDeleted) {
        return res.status(200).json({ message: 'Country deleted' });
      }
      return res.status(404).json({ message: 'Country not found' });
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting country', error });
    }
  }
}

export default new CountryController();
