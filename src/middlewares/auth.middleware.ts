import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserAccessTokenPayload } from '../auth/interfaces/userAccessTokenPayload.interface';
import { AdminAccessTokenPayload } from '../auth/interfaces/accessTokenPayload.interface';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

//
// ✅ Type Extensions
//
declare global {
  namespace Express {
    interface Request {
      user?: UserAccessTokenPayload;
      admin?: AdminAccessTokenPayload;
    }
  }
}

//
// ✅ Utility: Extract Bearer token from Authorization header
//
const extractToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.split(' ')[1];
};

//
// ✅ Utility: Verify JWT and return typed payload
//
const verifyToken = <T extends JwtPayload>(token: string): T | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch {
    return null;
  }
};

//
// ✅ Utility: Check facilityIds structure
//
const validateFacilityIds = (facilityIds: unknown): facilityIds is string[] => {
  return Array.isArray(facilityIds) &&
    facilityIds.length > 0 &&
    facilityIds.every(id => typeof id === 'string' && id.trim().length > 0);
};

//
// ✅ Middleware: Auth for user tokens
//
export const authenticateUser = (req: Request, res: Response, next: NextFunction): Response | void => {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ error: 'Missing or malformed Authorization header' });

  const decoded = verifyToken<UserAccessTokenPayload>(token);
  if (!decoded || decoded.tokenType !== 'user') {
    return res.status(401).json({ error: 'Invalid or expired user token' });
  }

  if (!validateFacilityIds(decoded.facilityIds)) {
    return res.status(403).json({ error: 'Invalid or missing facility access for user' });
  }

  req.user = decoded;
  next();
};

//
// ✅ Middleware: Auth for admin tokens
//
export const authenticateAdmin = (req: Request, res: Response, next: NextFunction): Response | void => {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ error: 'Missing or malformed Authorization header' });

  const decoded = verifyToken<AdminAccessTokenPayload>(token);
  if (!decoded || decoded.tokenType !== 'admin') {
    return res.status(401).json({ error: 'Invalid or expired admin token' });
  }

  if (!validateFacilityIds(decoded.facilityIds)) {
    return res.status(403).json({ error: 'Invalid or missing facility access for admin' });
  }

  req.admin = decoded;
  next();
};

//
// ✅ Middleware: Accepts either user or admin
//
export const authenticateAny = (req: Request, res: Response, next: NextFunction): Response | void => {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ error: 'Missing or malformed Authorization header' });

  const decoded = verifyToken<JwtPayload>(token);
  if (!decoded || typeof decoded !== 'object' || !decoded.tokenType) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  if (!validateFacilityIds(decoded.facilityIds)) {
    return res.status(403).json({ error: 'Invalid or missing facility access' });
  }

  if (decoded.tokenType === 'user') {
    req.user = decoded as UserAccessTokenPayload;
  } else if (decoded.tokenType === 'admin') {
    req.admin = decoded as AdminAccessTokenPayload;
  } else {
    return res.status(401).json({ error: 'Unknown token type' });
  }

  next();
};
