import jwt, { SignOptions } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { AuthIdentity } from '../interfaces/authIdentity.interface';
import { RefreshTokenPayload } from '../interfaces/refreshTokenPayload.interface';
import { Role } from '../../models/enums/role.enum';
import { AccessTokenPayload } from '../interfaces/accessTokenPayload.interface';

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_jwt_secret';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '2h';
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION || '7d';

export class TokenService {
  static generateAccessToken(identity: AuthIdentity): string {
    const tokenId = uuidv4();
    const now = Date.now();

    const payload: AccessTokenPayload = {
      tokenId,
      email: identity.email,
      userId: identity.id,
      idpId: identity.idpId,
      idpType: identity.idpType,
      role: identity.role,
      tokenType: 'access'
    };
    const options: SignOptions = { expiresIn: JWT_EXPIRATION as SignOptions['expiresIn'] };

    return jwt.sign(payload, JWT_SECRET, options);
  }

  static generateRefreshToken(identity: AuthIdentity): { token: string; sessionId: string } {
    const tokenId = uuidv4();
    const now = Date.now();

    const payload: RefreshTokenPayload = {
      tokenId,
      userId: identity.id,
      idpId: identity.idpId,
      idpType: identity.idpType,
      role: identity.role,
      tokenType: 'refresh'
    };
    const options: SignOptions = { expiresIn: REFRESH_TOKEN_EXPIRATION as SignOptions['expiresIn'] };
    return {
      token: jwt.sign(payload, JWT_SECRET, options),
      sessionId: tokenId,
    };
  }

  static verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
  }
}


   
