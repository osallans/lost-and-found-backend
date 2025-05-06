import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema } from 'zod';

export function validate(schema: ZodSchema): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        message: 'Validation failed',
        errors: result.error.format(),
      });
      return; // Important: prevent fallthrough
    }

    req.body = result.data;
    next();
  };


}


export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      res.status(400).json({ errors: result.error.format() });
      return;
    }

    // ✅ Store parsed data on a custom property instead
    (req as any).validatedQuery = result.data;

    next();
  };
}
