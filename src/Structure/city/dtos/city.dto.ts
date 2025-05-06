export interface CityDTO {
  id: string;
  name: string;
  name_ar?: string;  // Arabic name for city
  country_code: string;  // Foreign key to Country
  created_at: Date;
}
