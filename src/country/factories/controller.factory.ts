import { CountryController } from "../controllers/country.controller";
import { ICountryController } from "../interfaces/ICountryController";
import countryService from "./service.factory";

console.log('[FACTORY] countryService:', countryService);
const countryController:ICountryController = new CountryController(countryService);

export default countryController;