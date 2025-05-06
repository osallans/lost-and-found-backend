export interface SubcategoryDTO {
  id: string;
  category_id: string;  // Foreign key to Category
  name: string;
  name_ar?: string;     // Arabic name for subcategory
  created_at: Date;
}
