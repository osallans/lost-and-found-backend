import { SubcategoryDTO } from "../dtos/subcategory.dto";

class SubcategoryService {
  async createSubcategory(subcategoryData: SubcategoryDTO): Promise<SubcategoryDTO> {
    return subcategoryData;
  }

  async getSubcategoryById(id: string): Promise<SubcategoryDTO | null> {
    return { id, category_id: 'sample-category-id', name: 'Smartphones', name_ar: 'الهواتف الذكية', created_at: new Date() };
  }

  async updateSubcategory(id: string, subcategoryData: Partial<SubcategoryDTO>): Promise<SubcategoryDTO | null> {
    return { id, ...subcategoryData, created_at: new Date() };
  }

  async deleteSubcategory(id: string): Promise<boolean> {
    return true;
  }
}

export default new SubcategoryService();
