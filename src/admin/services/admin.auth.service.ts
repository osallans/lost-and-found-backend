import { v4 as uuidv4 } from 'uuid';
import jwt, { SignOptions } from 'jsonwebtoken';
import { pool } from '../../utils/db';
import { AdminAccessTokenPayload } from '../../auth/interfaces/adminAccessTokenPayload.interface';
import { AdminRefreshTokenPayload } from '../../auth/interfaces/adminRefreshTokenPayload.interface';

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_jwt_secret';
const JWT_EXPIRATION: number | string  = process.env.JWT_EXPIRATION || '2h';
const REFRESH_TOKEN_EXPIRATION:string | number = process.env.REFRESH_TOKEN_EXPIRATION || '7d';

export class AdminAuthService {

    static generateAccessToken(payload: AdminAccessTokenPayload) {
        const options: SignOptions = { expiresIn: JWT_EXPIRATION as SignOptions['expiresIn'] };
        return jwt.sign(payload, JWT_SECRET, options);
      }
    
      static generateRefreshToken(payload: AdminRefreshTokenPayload) {
        const options: SignOptions = { expiresIn: REFRESH_TOKEN_EXPIRATION as SignOptions['expiresIn'] };
        return jwt.sign(payload, JWT_SECRET, options);
      }

  static async findAdminByEmail(email: string) {
    const [rows]: any = await pool.query('SELECT * FROM Admins WHERE email = ?', [email]);
    if (rows.length === 0) return null;
    return rows[0];
  }

  static async createAdminWithEmailPassword(email: string, passwordHash: string) {
    const newId = uuidv4();
    await pool.query(
      'INSERT INTO Admins (id, email, password_hash, is_super_admin) VALUES (?, ?, ?, ?)',
      [newId, email, passwordHash, false]
    );
    return { id: newId, email };
  }
}
