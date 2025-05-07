// src/auth/services/auth.service.ts
import jwt, { SignOptions } from 'jsonwebtoken';
import { pool } from '../../utils/db';

import { v4 as uuidv4 } from 'uuid';
import { UserAccessTokenPayload } from '../interfaces/accessTokenPayload.interface';
import { UserRefreshTokenPayload } from '../interfaces/refreshTokenPayload.interface';

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_jwt_secret';
const JWT_EXPIRATION: string | number = process.env.JWT_EXPIRATION || '2h';
const REFRESH_TOKEN_EXPIRATION: string | number = process.env.REFRESH_TOKEN_EXPIRATION || '7d';

export class TokenService {
  static generateAccessToken(payload: UserAccessTokenPayload): string {
    const options: SignOptions = { expiresIn: JWT_EXPIRATION as SignOptions['expiresIn'] };
    return jwt.sign(payload, JWT_SECRET, options);
  }

  static generateRefreshToken(userId: string): { token: string; sessionId: string } {
    const sessionId = uuidv4();
    const payload: UserRefreshTokenPayload = {
      id: userId,
      sessionId,
      tokenType: 'refresh',
    };
    const options: SignOptions = { expiresIn: REFRESH_TOKEN_EXPIRATION as SignOptions['expiresIn'] };
    const token = jwt.sign(payload, JWT_SECRET, options);
    return { token, sessionId };
  }

  static verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
  }
}

