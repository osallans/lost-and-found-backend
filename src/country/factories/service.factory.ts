// src/services/index.ts

import { ICountryService } from "../interfaces/ICountryService";
import { CountryService } from "../services/country.service"; 


// Instantiate the service
const countryService: ICountryService = new CountryService();

export default countryService;