// src/modules/country/country.dto.ts
export class CountryDTO {
  code!: string;
  name!: string;
  name_ar?: string;
  created_at?: Date;
  is_deleted?: boolean;

  constructor(data: Partial<CountryDTO>) {
    Object.assign(this, data);
  }
}

// src/types/country.interface.ts
export interface ICountryDTO {
  code: string;
  name: string;
  name_ar?: string;
  created_at?: Date;
  is_deleted?: boolean;
}