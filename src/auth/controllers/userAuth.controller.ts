import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { findUserByEmail } from '../../user/services/user.service';
import { TokenService } from '../services/token.service';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export class UserAuthController {
  static async login(req: Request, res: Response) {
    const parse = loginSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: parse.error.errors });
    }

    const { email, password } = parse.data;
    const user = await findUserByEmail(email);

    if (!user || !user.password_hash) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = TokenService.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: 'USER',
      facilityIds: user.facility_ids || []
    });

    const refreshToken = TokenService.generateRefreshToken({ userId: user.id });

    return res.json({ accessToken, refreshToken });
  }

  static async refresh(req: Request, res: Response) {
    const { refreshToken } = req.body;
    try {
      const decoded = TokenService.verifyRefreshToken(refreshToken) as any;
      const accessToken = TokenService.generateAccessToken({
        userId: decoded.userId,
        role: 'USER'
      });
      return res.json({ accessToken });
    } catch {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
  }

  static async logout(_req: Request, res: Response) {
    return res.status(204).send();
  }
}
