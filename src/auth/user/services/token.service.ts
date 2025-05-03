// src/auth/services/auth.service.ts

import jwt, { SignOptions } from 'jsonwebtoken';
import { IDPType } from '../../../models/enums/idpType.enum'; // We'll create this enum next
import { pool } from '../../../utils/db';
import { UserAccessTokenPayload} from '../interfaces/userAccessTokenPayload.interface';
import { UserRefreshTokenPayload} from '../interfaces/userRefreshTokenPayload.interface';
import { v4 as uuidv4 } from 'uuid';
const JWT_SECRET = process.env.JWT_SECRET || 'your_default_jwt_secret';
const JWT_EXPIRATION: number | string  = process.env.JWT_EXPIRATION || '2h';
const REFRESH_TOKEN_EXPIRATION:string | number = process.env.REFRESH_TOKEN_EXPIRATION || '7d';

export class TokenService {
  static generateAccessToken<T extends object>(payload: T): string {
    const options: SignOptions = { expiresIn: JWT_EXPIRATION as SignOptions['expiresIn'] };
    return jwt.sign(payload, JWT_SECRET, options);
  }

  static  generateRefreshToken<T extends object>(payload: T): string {
    const options: SignOptions = { expiresIn: REFRESH_TOKEN_EXPIRATION as SignOptions['expiresIn'] };
    return jwt.sign(payload, JWT_SECRET, options);
  }
  /**
   * Verify Access or Refresh Token
   */
  static verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
  }
}

