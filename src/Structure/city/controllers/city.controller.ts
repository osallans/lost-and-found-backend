import { Request, Response } from 'express';
import CityService from '../services/city.service';
import { CityDTO } from '../dtos/city.dto';

class CityController {
  async create(req: Request, res: Response) {
    try {
      const cityData: CityDTO = req.body;
      const newCity = await CityService.createCity(cityData);
      return res.status(201).json(newCity);
    } catch (error) {
      return res.status(500).json({ message: 'Error creating city', error });
    }
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const city = await CityService.getCityById(id);
      if (city) {
        return res.status(200).json(city);
      }
      return res.status(404).json({ message: 'City not found' });
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching city', error });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const cityData: Partial<CityDTO> = req.body;
    try {
      const updatedCity = await CityService.updateCity(id, cityData);
      if (updatedCity) {
        return res.status(200).json(updatedCity);
      }
      return res.status(404).json({ message: 'City not found' });
    } catch (error) {
      return res.status(500).json({ message: 'Error updating city', error });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const isDeleted = await CityService.deleteCity(id);
      if (isDeleted) {
        return res.status(200).json({ message: 'City deleted' });
      }
      return res.status(404).json({ message: 'City not found' });
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting city', error });
    }
  }
}

export default new CityController();
