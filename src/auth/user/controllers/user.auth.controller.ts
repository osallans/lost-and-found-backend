import { Request, Response } from 'express';
import { UserAuthService } from '../services/user.auth.service';
import { IDPType } from '../../../models/enums/idpType.enum';
import { IDPVerifierFactory } from '../../strategies/idpVerifier.factory';
import { UserAccessTokenPayload } from '../interfaces/userAccessTokenPayload.interface';
import { UserRefreshTokenPayload } from '../interfaces/userRefreshTokenPayload.interface';
import bcrypt from 'bcrypt'; // new import!
export class UserAuthController {
  /**
   * (Optional) login using ID token directly
   */
  static async loginWithIDP(req: Request, res: Response) {
    const { idToken, idpType } = req.body;

    if (!idToken || !idpType) {
      return res.status(400).json({ error: 'Missing idToken or idpType' });
    }

    try {
      const verifier = IDPVerifierFactory.getVerifier(idpType as IDPType);
      const { idpId, email, name } = await verifier.verifyToken(idToken);

      const user = await UserAuthService.findOrCreateUserByIDP(idpId, email, idpType);

      let facilityIds: string[] = [];

      if (!user.is_super_admin) {
        facilityIds = await UserAuthService.getUserFacilityIds(user.id);
      }

      const payload: UserAccessTokenPayload = {
        userId: user.id,
        email: user.email,
        role: 'USER',
        facilityIds,
      };

      const accessToken = UserAuthService.generateAccessToken(payload);
      const refreshToken = UserAuthService.generateRefreshToken({ userId: user.id });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.status(200).json({ accessToken });
    } catch (error) {
      if (error instanceof Error) {
        console.error('AuthController loginWithIDP error:', error.message);
        return res.status(500).json({ error: error.message });
      } else {
        console.error('Unknown error:', error);
        return res.status(500).json({ error: 'Authentication failed' });
      }
    }
  }

  /**
   * Securely exchange Authorization Code using Client Secret
   */
  static async exchangeAuthorizationCode(req: Request, res: Response) {
    const { code, idpType } = req.body;

    if (!code || !idpType) {
      return res.status(400).json({ error: 'Missing authorization code or idpType' });
    }

    try {
      const verifier = IDPVerifierFactory.getVerifier(idpType as IDPType);

      if (!verifier.exchangeAuthorizationCode) {
        return res.status(400).json({ error: 'IDP does not support code exchange' });
      }

      const { idpId, email, name } = await verifier.exchangeAuthorizationCode(code);

      const user = await UserAuthService.findOrCreateUserByIDP(idpId, email, idpType);

      let facilityIds: string[] = [];

      if (!user.is_super_admin) {
        facilityIds = await UserAuthService.getUserFacilityIds(user.id);
      }

      const payload: UserAccessTokenPayload = {
        userId: user.id,
        email: user.email,
        role: 'USER',
        facilityIds,
      };

      const accessToken = UserAuthService.generateAccessToken(payload);
      const refreshToken = UserAuthService.generateRefreshToken({ userId: user.id });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.status(200).json({ accessToken });
    } catch (error) {
      if (error instanceof Error) {
        console.error('AuthController exchangeAuthorizationCode error:', error.message);
        return res.status(500).json({ error: error.message });
      } else {
        console.error('Unknown error:', error);
        return res.status(500).json({ error: 'Authentication failed' });
      }
    }
  }

  static async loginBasic(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and Password are required' });
    }

    try {
      const user = await UserAuthService.findUserByEmail(email);
      if (!user || !user.password_hash) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const facilityIds: string[] = user.is_super_admin ? [] : await UserAuthService.getUserFacilityIds(user.id);

      const payload: UserAccessTokenPayload = {
        userId: user.id,
        email: user.email,
        role: 'USER',
        facilityIds,
      };

      const accessToken = UserAuthService.generateAccessToken(payload);
      const refreshToken = UserAuthService.generateRefreshToken({ userId: user.id });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.status(200).json({ accessToken });
    } catch (error) {
      if (error instanceof Error) {
        console.error('AuthController loginBasic error:', error.message);
        return res.status(500).json({ error: error.message });
      } else {
        console.error('Unknown error:', error);
        return res.status(500).json({ error: 'Login failed' });
      }
    }
  }
  /**
   * Refresh Access Token using valid Refresh Token
   */
  static async refreshAccessToken(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Missing refresh token' });
    }

    try {
        
      const decoded = UserAuthService.verifyToken(refreshToken) as UserRefreshTokenPayload;

      const user = await UserAuthService.findUserById(decoded.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      let facilityIds: string[] = [];

      if (!user.is_super_admin) {
        facilityIds = await UserAuthService.getUserFacilityIds(user.id);
      }

      const payload: UserAccessTokenPayload = {
        userId: user.id,
        email: user.email,
        role: 'USER',
        facilityIds,
      };

      const accessToken = UserAuthService.generateAccessToken(payload);

      return res.status(200).json({ accessToken });
    } catch (error) {
      if (error instanceof Error) {
        console.error('AuthController refreshAccessToken error:', error.message);
        return res.status(403).json({ error: error.message });
      } else {
        console.error('Unknown error:', error);
        return res.status(403).json({ error: 'Invalid refresh token' });
      }
    }
  }

  static async register(req: Request, res: Response) {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and Password are required' });
    }
  
    try {
      const existingUser = await UserAuthService.findUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: 'Email already in use' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 12);
  
      const newUser = await UserAuthService.createUserWithEmailPassword(email, hashedPassword);
  
      return res.status(201).json({ message: 'User created', userId: newUser.id });
    } catch (error) {
      if (error instanceof Error) {
        console.error('AuthController register error:', error.message);
        return res.status(500).json({ error: error.message });
      } else {
        console.error('Unknown error:', error);
        return res.status(500).json({ error: 'Registration failed' });
      }
    }
  }
  
}
