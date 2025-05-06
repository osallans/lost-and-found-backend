// src/utils/zodHelpers.ts
import { z } from 'zod';
import { stripHtml } from './sanitize';

// For required strings
export const stringSanitized = () =>
  z.string().trim().transform(stripHtml);

// For optional strings
export const optionalStringSanitized = () =>
  z.string().trim().transform(stripHtml).optional();