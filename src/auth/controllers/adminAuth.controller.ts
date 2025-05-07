import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { AdminService } from '../../admin/services/admin.service';
import { TokenService } from '../services/token.service';
import { AdminAccessTokenPayload } from '../interfaces/accessTokenPayload.interface';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export class AdminAuthController {
  static async register(req: Request, res: Response) {
    const parse = credentialsSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: parse.error.errors });
    }

    const { email, password } = parse.data;
    const existingAdmin = await AdminService.findAdminByEmail(email);
    if (existingAdmin) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newAdmin = await AdminService.createAdminWithEmailPassword(email, hashedPassword);

    return res.status(201).json({ message: 'Admin created', adminId: newAdmin.id });
  }

  static async login(req: Request, res: Response) {
    const parse = credentialsSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: parse.error.errors });
    }

    const { email, password } = parse.data;
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
      facilityIds: admin.facility_ids || []
    };

    const accessToken = TokenService.generateAccessToken(payload);
    const refreshToken = TokenService.generateRefreshToken({ adminId: admin.id });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ accessToken });
  }

  static async logout(_req: Request, res: Response) {
    return res.status(204).send();
  }
}
