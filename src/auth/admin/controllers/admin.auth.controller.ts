import { Request, Response } from 'express';
import { AdminAuthService } from '../services/admin.auth.service';

import bcrypt from 'bcrypt';
import { AdminAccessTokenPayload } from '../interfaces/adminAccessTokenPayload.interface';

export class AdminAuthController {
  static async register(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and Password are required' });
    }

    try {
      const existingAdmin = await AdminAuthService.findAdminByEmail(email);
      if (existingAdmin) {
        return res.status(409).json({ error: 'Email already in use' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const newAdmin = await AdminAuthService.createAdminWithEmailPassword(email, hashedPassword);

      return res.status(201).json({ message: 'Admin created', adminId: newAdmin.id });
    } catch (error) {
      if (error instanceof Error) {
        console.error('AdminAuthController register error:', error.message);
        return res.status(500).json({ error: error.message });
      } else {
        console.error('Unknown error:', error);
        return res.status(500).json({ error: 'Registration failed' });
      }
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and Password are required' });
    }

    try {
      const admin = await AdminAuthService.findAdminByEmail(email);
      if (!admin || !admin.password_hash) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, admin.password_hash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const payload: AdminAccessTokenPayload = {
        adminId: admin.id,
        email: admin.email,
        isSuperAdmin: admin.is_super_admin,
        role: 'ADMIN',
        facilityIds: []
      };

      const accessToken = AdminAuthService.generateAccessToken(payload);
      const refreshToken = AdminAuthService.generateRefreshToken({ adminId: admin.id });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.status(200).json({ accessToken });
    } catch (error) {
      if (error instanceof Error) {
        console.error('AdminAuthController login error:', error.message);
        return res.status(500).json({ error: error.message });
      } else {
        console.error('Unknown error:', error);
        return res.status(500).json({ error: 'Login failed' });
      }
    }
  }
}
