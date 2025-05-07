import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { pool } from '../../utils/db';
import { v4 as uuidv4 } from 'uuid';

import { TokenService } from '../services/token.service';
import { findUserBy } from '../../user/services/user.service';
import { AdminService } from '../../admin/services/admin.service';

import { AdminAccessTokenPayload } from '../interfaces/adminAccessTokenPayload.interface';
import { UserAccessTokenPayload } from '../interfaces/userAccessTokenPayload.interface';

class AuthController {
  /**
   * User login
   */
  async loginUser(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and Password are required' });
    }

    const user = await findUserByEmail(email);
    if (!user || !user.password_hash) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessPayload: UserAccessTokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      idpType: user.idp_type,
      facilityIds: user.facility_ids,
      tokenType: 'access',
    };

    const accessToken = TokenService.generateAccessToken(accessPayload);
    const { token: refreshToken } = TokenService.generateRefreshToken(user.id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ accessToken });
  }

  /**
   * Admin login
   */
  async loginAdmin(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and Password are required' });
    }

    const admin = await AdminService.findAdminByEmail(email);
    if (!admin || !admin.password_hash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessPayload: AdminAccessTokenPayload = {
      adminId: admin.id,
      email: admin.email,
      role: 'ADMIN',
      isSuperAdmin: admin.is_super_admin,
      facilityIds: [],
      tokenType: 'access',
    };

    const accessToken = TokenService.generateAccessToken(accessPayload);
    const { token: refreshToken } = TokenService.generateRefreshToken(admin.id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ accessToken });
  }

  /**
   * Refresh access token from cookie
   */
  async refreshAccessToken(req: Request, res: Response) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Missing refresh token' });
    }

    try {
      const decoded = TokenService.verifyToken(refreshToken) as any;
      if (decoded.tokenType !== 'refresh') {
        return res.status(401).json({ error: 'Invalid refresh token' });
      }

      const result = await pool.query(
        `SELECT id, email, role, idp_type, facility_ids FROM users WHERE id = $1`,
        [decoded.id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = result.rows[0];

      const accessToken = TokenService.generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role,
        idpType: user.idp_type,
        facilityIds: user.facility_ids,
        tokenType: 'access',
      });

      return res.status(200).json({ accessToken });
    } catch (error) {
      console.error('[RefreshToken] Error:', error);
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
  }

  /**
   * Logout
   */
  logout(req: Request, res: Response) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return res.status(204).send();
  }

  /**
   * Admin Registration (if you want to keep this here)
   */
  async registerAdmin(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and Password are required' });
    }

    try {
      const existingAdmin = await AdminService.findAdminByEmail(email);
      if (existingAdmin) {
        return res.status(409).json({ error: 'Email already in use' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const newAdmin = await AdminService.createAdminWithEmailPassword(email, hashedPassword);

      return res.status(201).json({ message: 'Admin created', adminId: newAdmin.id });
    } catch (error) {
      console.error('Admin registration failed:', error);
      return res.status(500).json({ error: 'Registration failed' });
    }
  }
}

export default new AuthController();
