// src/routes/country.routes.ts
import { Router } from 'express';
import CountryController from '../controllers/country.controller';

import {
  CreateCountrySchema,
  UpdateCountrySchema,
} from '../validators/country.validator';
import { PaginationQuerySchema } from '../../utils/common.validator';

import { validate, validateQuery } from '../../middlewares/validation.middleware';
import { asyncHandler } from '../../middlewares/asynchandler';

const router = Router();

// GET all countries (paginated)
router.get('/countries', validateQuery(PaginationQuerySchema),asyncHandler(CountryController.getAll));

// GET a single country by code
router.get('/countries/:code', asyncHandler(CountryController.getByCode));

// POST a new country
router.post(
  '/countries',
  validate(CreateCountrySchema),
  asyncHandler(CountryController.create)
);

// PUT update an existing country
router.put(
  '/countries/:code',
  validate(UpdateCountrySchema),
  asyncHandler(CountryController.update)
);

// DELETE (soft delete) a country
router.delete('/countries/:code', asyncHandler(CountryController.delete));

export default router;
