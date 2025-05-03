// src/auth/controllers/auth.controller.ts

import { Request, Response } from 'express';
import { TokenService } from '../services/token.service';

import bcrypt from 'bcrypt';
import { findUserByEmail } from '../../user/services/user.service';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (!user || !user.password_hash) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const accessToken = TokenService.generateAccessToken({ id: user.id, role: user.role });
  const refreshToken = TokenService.generateRefreshToken({ id: user.id });

  return res.json({ accessToken, refreshToken });
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  try {
    const decoded = TokenService.verifyToken(refreshToken) as any;
    const accessToken = TokenService.generateAccessToken({ id: decoded.id, role: decoded.role });
    return res.json({ accessToken });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};

static async register(req: Request, res: Response) {
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
    const admin = await AdminService.findAdminByEmail(email);
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

    const accessToken = AdminService.generateAccessToken(payload);
    const refreshToken = AdminService.generateRefreshToken({ adminId: admin.id });

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

export const logout = async (_req: Request, res: Response) => {
  // For now, just send success; implement token invalidation if needed
  return res.status(204).send();
};
