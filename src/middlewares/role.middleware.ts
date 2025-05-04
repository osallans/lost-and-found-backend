import { Request, Response, NextFunction } from 'express';

export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user; // Assuming that 'authenticate' middleware has added the user to req
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    next(); // Proceed to the next middleware or route handler
  };
};
