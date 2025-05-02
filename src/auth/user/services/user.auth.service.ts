// src/auth/services/auth.service.ts

import jwt, { SignOptions } from 'jsonwebtoken';
import { IDPType } from '../../../models/enums/idpType.enum'; // We'll create this enum next
import { pool } from '../../../utils/db';
import { UserAccessTokenPayload} from '../interfaces/userAccessTokenPayload.interface';
import { UserRefreshTokenPayload} from '../interfaces/userRefreshTokenPayload.interface';
import { v4 as uuidv4 } from 'uuid';
const JWT_SECRET = process.env.JWT_SECRET || 'your_default_jwt_secret';
const JWT_EXPIRATION: number | string  = process.env.JWT_EXPIRATION || '2h';
const REFRESH_TOKEN_EXPIRATION:string | number = process.env.REFRESH_TOKEN_EXPIRATION || '7d';

export class UserAuthService {
  static generateAccessToken(payload: UserAccessTokenPayload) {
    const options: SignOptions = { expiresIn: JWT_EXPIRATION as SignOptions['expiresIn'] };
    return jwt.sign(payload, JWT_SECRET, options);
  }

  static generateRefreshToken(payload: UserRefreshTokenPayload) {
    const options: SignOptions = { expiresIn: REFRESH_TOKEN_EXPIRATION as SignOptions['expiresIn'] };
    return jwt.sign(payload, JWT_SECRET, options);
  }
  /**
   * Verify Access or Refresh Token
   */
  static verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
  }

  /**
   * Find an existing user by ID
   */
  static async findUserById(userId: string) {
    const [rows]: any = await pool.query('SELECT * FROM Users WHERE id = ?', [userId]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  }

  /**
   * Find existing User or Create new one by IDP credentials
   */
  static async findOrCreateUserByIDP(idpId: string, email: string, idpType: IDPType) {
    const [rows]: any = await pool.query('SELECT * FROM Users WHERE idp_id = ? AND idp_type = ?', [idpId, idpType]);
    
    if (rows.length > 0) {
      return rows[0];
    }
  
    const newId = uuidv4(); // 👈 generate new UUID manually
  
    const [insertResult]: any = await pool.query(
      'INSERT INTO Users (id, email, idp_id, idp_type) VALUES (?, ?, ?, ?)',
      [newId, email, idpId, idpType, false]
    );
  
    const newUser = {
      id: newId,
      email,
      idp_id: idpId,
      idp_type: idpType
    };
  
    return newUser;
  }
  static async findUserByEmail(email: string) {
    const [rows]: any = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
    if (rows.length === 0) return null;
    return rows[0];
  }
  
  static async createUserWithEmailPassword(email: string, passwordHash: string) {
    const newId = uuidv4(); // Don't forget UUID!
    const [result]: any = await pool.query(
      'INSERT INTO Users (id, email, password_hash) VALUES (?, ?, ?)',
      [newId, email, passwordHash, false]
    );
    return { id: newId, email };
  }
  /**
   * Fetch the Facility IDs the user belongs to
   */
  static async getUserFacilityIds(userId: string): Promise<string[]> {
    const [rows]: any = await pool.query(
      'SELECT facility_id FROM Facility_Users WHERE user_id = ? AND approved = true',
      [userId]
    );

    return rows.map((row: any) => row.facility_id);
  }
}

