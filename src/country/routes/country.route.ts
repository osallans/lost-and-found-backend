import { Router } from 'express';

import {
  CreateCountrySchema,
  UpdateCountrySchema,
} from '../validators/country.validator';
import { PaginationQuerySchema } from '../../utils/common.validator';
import { validate, validateQuery } from '../../middlewares/validation.middleware';
import { asyncHandler } from '../../middlewares/asynchandler';
import { resolveController } from '../../registry/controller.registry';

const countryController = resolveController('country');


const router = Router();

router.get('/', validateQuery(PaginationQuerySchema), asyncHandler(countryController.getAll));
router.get('/:id', asyncHandler(countryController.getById));
router.post('/', validate(CreateCountrySchema), asyncHandler(countryController.create));
router.put('/:id', validate(UpdateCountrySchema), asyncHandler(countryController.update));
router.delete('/:id', asyncHandler(countryController.delete));

export default router;
