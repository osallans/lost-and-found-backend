import { Request, Response } from 'express';
import SubcategoryService from '../services/subcategory.service';
import { SubcategoryDTO } from '../dtos/subcategory.dto';

class SubcategoryController {
  async create(req: Request, res: Response) {
    try {
      const subcategoryData: SubcategoryDTO = req.body;
      const newSubcategory = await SubcategoryService.createSubcategory(subcategoryData);
      return res.status(201).json(newSubcategory);
    } catch (error) {
      return res.status(500).json({ message: 'Error creating subcategory', error });
    }
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const subcategory = await SubcategoryService.getSubcategoryById(id);
      if (subcategory) {
        return res.status(200).json(subcategory);
      }
      return res.status(404).json({ message: 'Subcategory not found' });
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching subcategory', error });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const subcategoryData: Partial<SubcategoryDTO> = req.body;
    try {
      const updatedSubcategory = await SubcategoryService.updateSubcategory(id, subcategoryData);
      if (updatedSubcategory) {
        return res.status(200).json(updatedSubcategory);
      }
      return res.status(404).json({ message: 'Subcategory not found' });
    } catch (error) {
      return res.status(500).json({ message: 'Error updating subcategory', error });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const isDeleted = await SubcategoryService.deleteSubcategory(id);
      if (isDeleted) {
        return res.status(200).json({ message: 'Subcategory deleted' });
      }
      return res.status(404).json({ message: 'Subcategory not found' });
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting subcategory', error });
    }
  }
}

export default new SubcategoryController();
