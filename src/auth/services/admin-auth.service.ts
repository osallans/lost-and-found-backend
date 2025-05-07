import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { AdminModel } from '../../models/admin.model'; // Adjust based on your ORM
import { TokenService } from './token.service';
import { AdminAccessTokenPayload } from '../interfaces/accessTokenPayload.interface';
import { AdminRefreshTokenPayload } from '../interfaces/refreshTokenPayload.interface';

const SALT_ROUNDS = 10;

export class AdminAuthService {
  // Register admin (optional, could be restricted)
  async register(adminData: { email: string; password: string }) {
    const existing = await AdminModel.findOne({ email: adminData.email });
    if (existing) {
      throw new Error('Admin already exists');
    }

    const hashedPassword = await bcrypt.hash(adminData.password, SALT_ROUNDS);
    const admin = new AdminModel({
      ...adminData,
      password: hashedPassword,
    });

    await admin.save();

    return this.generateAuthTokens(admin._id.toString(), admin.email);
  }

  // Admin login
  async login(email: string, password: string) {
    const admin = await AdminModel.findOne({ email });
    if (!admin) throw new Error('Invalid credentials');

    const match = await bcrypt.compare(password, admin.password);
    if (!match) throw new Error('Invalid credentials');

    return this.generateAuthTokens(admin._id.toString(), admin.email);
  }

  // Generate access & refresh tokens for admin
  private generateAuthTokens(adminId: string, email: string) {
    const accessPayload: AdminAccessTokenPayload = {
      adminId,
      email,
      role: 'admin',
    };

    const refreshPayload: AdminRefreshTokenPayload = {
      adminId,
      tokenId: uuidv4(),
      role: 'admin',
    };

    const accessToken = TokenService.generateAccessToken(accessPayload);
    const refreshToken = TokenService.generateRefreshToken(refreshPayload);

    return { accessToken, refreshToken };
  }
}
