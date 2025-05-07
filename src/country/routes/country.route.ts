import { Router } from 'express';

import {
  CreateCountrySchema,
  UpdateCountrySchema,
} from '../validators/country.validator';
import { PaginationQuerySchema } from '../../utils/common.validator';
import { validate, validateQuery } from '../../middlewares/validation.middleware';
import { asyncHandler } from '../../middlewares/asynchandler';
import countryController from '../factories/controller.factory';


const router = Router();
const BASE_PATH = '/countries';

router.get(BASE_PATH, validateQuery(PaginationQuerySchema), asyncHandler(countryController.getAll));
router.get(`${BASE_PATH}/:code`, asyncHandler(countryController.getByCode));
router.post(BASE_PATH, validate(CreateCountrySchema), asyncHandler(countryController.create));
router.put(`${BASE_PATH}/:code`, validate(UpdateCountrySchema), asyncHandler(countryController.update));
router.delete(`${BASE_PATH}/:code`, asyncHandler(countryController.delete));

export default router;
