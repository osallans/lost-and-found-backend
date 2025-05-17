import { BaseDTO } from "../../interfaces/baseDto.interface";

// src/modules/country/country.dto.ts
export class CountryDTO implements ICountryDTO{
  id?: string;
  code!: string;
  name!: string;
  name_ar?: string;
  created_at?: Date;
  updated_at?: Date;
  is_deleted?: boolean;

  constructor(data: Partial<CountryDTO>) {
    Object.assign(this, data);
  }
}

// src/types/country.interface.ts

  export interface ICountryDTO extends BaseDTO {
    code: string;
    name: string;
    name_ar?: string;
  }
