import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { TokenService } from './token.service';
import { IDPType } from '../../models/enums/idpType.enum';
import { Role } from '../../models/enums/role.enum';
import { AuthIdentity } from '../interfaces/authIdentity.interface';
import { IdentityProvider } from '../interfaces/identityProvider.interface';
import { RefreshTokenPayload } from '../interfaces/refreshTokenPayload.interface';

const SALT_ROUNDS = 10;

export class AuthService {
  constructor(
    private readonly identityProviders: Record<Role, IdentityProvider>
  ) {}

  /**
   * Register a new user (only supports Role.USER).
   */
  // async registerUser(userData: { email: string; password: string; idpType?: IDPType }) {
  //   const provider = this.identityProviders[Role.USER];
  //   if (!provider || !('register' in provider)) {
  //     throw new Error('User registration not supported');
  //   }

  //   const identity = await provider.register(userData);
  //   return this.generateAuthTokens(identity);
  // }

  /**
   * Login for any supported role.
   */
  async loginBasic(email: string, password: string, role: Role) {
    const provider = this.identityProviders[role];
    if (!provider) {
      throw new Error(`Unsupported role: ${role}`);
    }

    const identity = await provider.findByEmail(email);
    if (!identity) {
      throw new Error('Invalid credentials');
    }

    const isValid = await provider.validatePassword(email, password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    return this.generateAuthTokens(identity);
  }

  /**
   * Centralized Token Generation (Access + Refresh).
   */
  private generateAuthTokens(identity: AuthIdentity) {
    const accessToken = TokenService.generateAccessToken(identity);
    const { token: refreshToken, sessionId } = TokenService.generateRefreshToken(identity);
    return { accessToken, refreshToken, sessionId };
  }

  async revokeSession(sessionId: string) {  
    return null;
  }
  /**
   * Refresh the access token using a valid refresh token.
   */
  async refreshAccessToken(refreshToken: string) {
    let decoded: RefreshTokenPayload;

    try {
      decoded = TokenService.verifyToken(refreshToken) as RefreshTokenPayload;
    } catch (err) {
      throw new Error('Invalid or expired refresh token');
    }

    const provider = this.identityProviders[decoded.role];
    if (!provider) {
      throw new Error(`Unsupported role: ${decoded.role}`);
    }

 // ✅ Re-validate user existence based on userId
 const identity = await provider.findById(decoded.userId);
 if (!identity || identity.id !== decoded.userId) {
   throw new Error('Refresh token does not match any valid user');
 }
    if (!identity || identity.id !== decoded.userId) {
      throw new Error('Refresh token does not match any valid user');
    }

    // Issue new access token
    const accessToken = TokenService.generateAccessToken(identity);
    return { accessToken };
  }
}


