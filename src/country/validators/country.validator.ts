import { z } from 'zod';
import { optionalStringSanitized, stringSanitized } from '../../utils/zodHelpers';

// Base Schema with Field Validations
export const CountrySchema = z.object({
  code: z
    .string()
    .trim()
    .length(2, { message: 'Country code must be exactly 2 characters' })
    .regex(/^[A-Z]{2}$/, { message: 'Country code must be uppercase letters (A-Z)' })
    .toUpperCase(),

  name: stringSanitized(),

  name_ar: optionalStringSanitized(),
});


export const CreateCountrySchema = CountrySchema;


export const UpdateCountrySchema = CountrySchema.partial().refine((data) => {
  if (data.code && data.code.length !== 2) {
    return false;
  }
  if (data.code && !/^[A-Z]{2}$/.test(data.code)) {
    return false;
  }
  return true;
}, {
  message: 'If provided, country code must be exactly 2 uppercase letters',
});
