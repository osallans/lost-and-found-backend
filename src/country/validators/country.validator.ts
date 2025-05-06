import sanitizeHtml from 'sanitize-html';// src/validators/country.validator.ts
import { z } from 'zod';
import { optionalStringSanitized, stringSanitized } from '../../utils/zodHelpers';


export const CountrySchema = z.object({
  code: z
    .string()
    .trim()
    .length(2, { message: 'Country code must be 2 characters' })
    .toUpperCase(),

  name: stringSanitized(),

  name_ar: optionalStringSanitized(),
});

export const CreateCountrySchema = CountrySchema;

export const UpdateCountrySchema = CountrySchema.partial();
