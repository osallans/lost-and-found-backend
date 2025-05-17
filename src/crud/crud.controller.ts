import { Request, Response, NextFunction } from 'express';
import { ICrudService } from '../interfaces/crudService.interface';

export class GenericCrudController<T> {
  constructor(private readonly service: ICrudService<T>) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.create(req.body);
      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 20;
      const result = await this.service.getAllPaginated(page, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getById(req.params.id);
      if (!data) return res.status(404).json({ message: 'Not found' });
      res.json(data);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.update(req.params.id, req.body);
      if (!data) return res.status(404).json({ message: 'Not found' });
      res.json(data);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleted = await this.service.delete(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Not found' });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
