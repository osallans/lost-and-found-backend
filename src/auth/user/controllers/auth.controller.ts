// src/auth/controllers/auth.controller.ts

import { Request, Response } from 'express';
import { TokenService } from '../services/token.service';

import bcrypt from 'bcrypt';
import { findUserByEmail } from '../../../user/services/user.service';

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

export const logout = async (_req: Request, res: Response) => {
  // For now, just send success; implement token invalidation if needed
  return res.status(204).send();
};
