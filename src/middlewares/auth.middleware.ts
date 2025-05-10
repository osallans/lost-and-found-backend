import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Role } from '../models/enums/role.enum';
import { AccessTokenPayload, AdminAccessTokenPayload, ManagerAccessTokenPayload, UserAccessTokenPayload } from '../auth/interfaces/accessTokenPayload.interface';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// ✅ Extend Request Type
declare global {
  namespace Express {
    interface Request {
      user?: UserAccessTokenPayload;
      admin?: AdminAccessTokenPayload;
      manager?: ManagerAccessTokenPayload;
    }
  }
}

// ✅ Extract Bearer Token
const extractToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  return authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
};

// ✅ Verify JWT
const verifyToken = <T extends JwtPayload>(token: string): T | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch {
    return null;
  }
};

// ✅ Facility Validation
const validateFacilityIds = (facilityIds: unknown): facilityIds is string[] =>
  Array.isArray(facilityIds) && facilityIds.every(id => typeof id === 'string' && id.trim().length > 0);

// ✅ User Middleware
export const authenticateUser = (req: Request, res: Response, next: NextFunction): void | Response => {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ error: 'Missing or malformed Authorization header' });

  const decoded = verifyToken<AccessTokenPayload>(token);
  if (!decoded || decoded.tokenType !== 'access' || decoded.role !== Role.USER) {
    return res.status(401).json({ error: 'Invalid or expired user token' });
  }

  if (!validateFacilityIds(decoded.facilityIds)) {
    return res.status(403).json({ error: 'Invalid or missing facility access for user' });
  }

  req.user = decoded as UserAccessTokenPayload;
  next();
};

// ✅ Admin Middleware
export const authenticateAdmin = (req: Request, res: Response, next: NextFunction): void | Response => {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ error: 'Missing or malformed Authorization header' });

  const decoded = verifyToken<AccessTokenPayload>(token);
  if (!decoded || decoded.tokenType !== 'access' || decoded.role !== Role.ADMIN) {
    return res.status(401).json({ error: 'Invalid or expired admin token' });
  }

  req.admin = decoded as AdminAccessTokenPayload;
  next();
};

// ✅ Manager Middleware
export const authenticateManager = (req: Request, res: Response, next: NextFunction): void | Response => {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ error: 'Missing or malformed Authorization header' });

  const decoded = verifyToken<AccessTokenPayload>(token);
  if (!decoded || decoded.tokenType !== 'access' || decoded.role !== Role.MANAGER) {
    return res.status(401).json({ error: 'Invalid or expired manager token' });
  }

  if (!validateFacilityIds(decoded.facilityIds)) {
    return res.status(403).json({ error: 'Invalid or missing facility access for manager' });
  }

  req.manager = decoded as ManagerAccessTokenPayload;
  next();
};

// ✅ Universal Middleware
export const authenticateAny = (req: Request, res: Response, next: NextFunction): void | Response => {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ error: 'Missing or malformed Authorization header' });

  const decoded = verifyToken<AccessTokenPayload>(token);
  if (!decoded || decoded.tokenType !== 'access') {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  switch (decoded.role) {
    case Role.USER:
      if (!validateFacilityIds(decoded.facilityIds)) {
        return res.status(403).json({ error: 'Invalid or missing facility access for user' });
      }
      req.user = decoded as UserAccessTokenPayload;
      break;

    case Role.ADMIN:
      req.admin = decoded as AdminAccessTokenPayload;
      break;

    case Role.MANAGER:
      if (!validateFacilityIds(decoded.facilityIds)) {
        return res.status(403).json({ error: 'Invalid or missing facility access for manager' });
      }
      req.manager = decoded as ManagerAccessTokenPayload;
      break;

    default:
      return res.status(401).json({ error: 'Unknown role' });
  }

  next();
};
