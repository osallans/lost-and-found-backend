
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../../utils/db';
import { IDPType } from '../../models/enums/idpType.enum';

export const findUserById = async (userId: string) => {
  const [rows]: any = await pool.query('SELECT * FROM Users WHERE id = ?', [userId]);
  return rows.length > 0 ? rows[0] : null;
};

export const findUserByEmail = async (email: string) => {
  const [rows]: any = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
  return rows.length > 0 ? rows[0] : null;
};

export const createUserWithEmailPassword = async (email: string, passwordHash: string) => {
  const newId = uuidv4();
  const [result]: any = await pool.query(
    'INSERT INTO Users (id, email, password_hash) VALUES (?, ?, ?)',
    [newId, email, passwordHash]
  );
  return { id: newId, email };
};

export const findOrCreateUserByIDP = async (idpId: string, email: string, idpType: IDPType) => {
  const [rows]: any = await pool.query(
    'SELECT * FROM Users WHERE idp_id = ? AND idp_type = ?',
    [idpId, idpType]
  );

  if (rows.length > 0) return rows[0];

  const newId = uuidv4();
  await pool.query(
    'INSERT INTO Users (id, email, idp_id, idp_type) VALUES (?, ?, ?, ?)',
    [newId, email, idpId, idpType]
  );

  return { id: newId, email, idp_id: idpId, idp_type: idpType };
};

export const getUserFacilityIds = async (userId: string): Promise<string[]> => {
  const [rows]: any = await pool.query(
    'SELECT facility_id FROM Facility_Users WHERE user_id = ? AND approved = true',
    [userId]
  );
  return rows.map((row: any) => row.facility_id);
};
