import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserModel } from '../../models/user.model'; // Adjust for your ORM
import { TokenService } from './token.service';
import { IDPType } from '../../models/enums/idpType.enum';
import { UserAccessTokenPayload } from '../interfaces/userAccessTokenPayload.interface';
import { UserRefreshTokenPayload } from '../interfaces/userRefreshTokenPayload.interface';

const SALT_ROUNDS = 10;

export class AuthService {
  // Register user
  async register(userData: { email: string; password: string; idpType?: IDPType }) {
    const existing = await UserModel.findOne({ email: userData.email });
    if (existing) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
    const user = new UserModel({
      ...userData,
      password: hashedPassword,
      idpType: userData.idpType || IDPType.LOCAL,
    });

    await user.save();

    return this.generateAuthTokens(user._id.toString(), user.email);
  }

  // Login
  async login(email: string, password: string) {
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Invalid credentials');

    return this.generateAuthTokens(user._id.toString(), user.email);
  }

  // Generate both tokens
  private generateAuthTokens(userId: string, email: string) {
    const accessPayload: UserAccessTokenPayload = { userId, email };
    const refreshPayload: UserRefreshTokenPayload = { userId, tokenId: uuidv4() };

    const accessToken = TokenService.generateAccessToken(accessPayload);
    const refreshToken = TokenService.generateRefreshToken(refreshPayload);

    return { accessToken, refreshToken };
  }
}
