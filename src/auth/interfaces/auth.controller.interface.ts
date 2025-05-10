import { Request, Response, NextFunction } from 'express';

export interface AuthControllerInterface {
  loginBasic(req: Request, res: Response, next: NextFunction): Promise<void>;
  refreshAccessToken(req: Request, res: Response, next: NextFunction): Promise<void>;
  revokeSession(req: Request, res: Response, next: NextFunction): Promise<void>;
}