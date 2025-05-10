import { z } from 'zod';

export function isValidEnumValue<T extends Record<string, string>>(
    enumObj: T,
    value: string
  ): value is T[keyof T] {
    return Object.values(enumObj).includes(value as T[keyof T]);
}

export const PaginationQuerySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, 'Page must be a number')
    .transform(Number)
    .default('1'),
  limit: z
    .string()
    .regex(/^\d+$/, 'Limit must be a number')
    .transform(Number)
    .default('20'),
});

export const UUIDParamSchema = z.object({
  id: z.string().uuid({ message: 'Invalid UUID format' }),
});

export const CodeParamSchema = z.object({
  code: z.string().length(2, 'Code must be exactly 2 characters'),
});
