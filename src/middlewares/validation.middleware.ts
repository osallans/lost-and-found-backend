import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateUser = [
  body('email').isEmail().withMessage('Email is required and should be valid'),
  body('name').notEmpty().withMessage('Name is required'),
  body('role').isIn(['user', 'admin', 'manager']).withMessage('Role must be one of [user, admin, manager]'),
  
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next(); // Proceed to the next middleware or route handler
  }
];
