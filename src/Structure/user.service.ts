
import { pool } from '../../../utils/db';  // Import the database connection

class AdminService {
  // Create a new admin
  async createAdmin(adminData: { name: string, email: string, password: string, role: string, is_super_admin: boolean }) {
    const { name, email, password, role, is_super_admin } = adminData;

    const query = `
      INSERT INTO admins (name, email, password, role, is_super_admin, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id, name, email, role, is_super_admin, created_at, updated_at;
    `;
    const values = [name, email, password, role, is_super_admin];

    const result = await pool.query(query, values);
    return result.rows[0];  // Return the created admin data
  }

  // Get admin by ID
  async getAdminById(id: string) {
    const query = 'SELECT * FROM admins WHERE id = $1 AND is_deleted = false';
    const values = [id];

    const result = await pool.query(query, values);
    return result.rows[0] || null;  // Return null if admin not found
  }

  // Find admin by email
  async findAdminByEmail(email: string) {
    const query = 'SELECT * FROM admins WHERE email = $1 AND is_deleted = false';
    const values = [email];

    const result = await pool.query(query, values);
    return result.rows[0] || null;  // Return null if admin not found
  }

  // Create admin with email and password
  async createAdminWithEmailPassword(email: string, password: string, name: string, role: string, is_super_admin: boolean) {
    const query = `
      INSERT INTO admins (email, password, name, role, is_super_admin, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id, email, name, role, is_super_admin, created_at, updated_at;
    `;
    const values = [email, password, name, role, is_super_admin];

    const result = await pool.query(query, values);
    return result.rows[0];  // Return the created admin data
  }

  // Update an existing admin
  async updateAdmin(id: string, adminData: { name?: string, email?: string, role?: string, is_super_admin?: boolean }) {
    const fields = [];
    const values = [];

    if (adminData.name) {
      fields.push('name = $' + (fields.length + 1));
      values.push(adminData.name);
    }
    if (adminData.email) {
      fields.push('email = $' + (fields.length + 1));
      values.push(adminData.email);
    }
    if (adminData.role) {
      fields.push('role = $' + (fields.length + 1));
      values.push(adminData.role);
    }
    if (adminData.is_super_admin !== undefined) {
      fields.push('is_super_admin = $' + (fields.length + 1));
      values.push(adminData.is_super_admin);
    }

    const query = `
      UPDATE admins
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${fields.length + 1}
      RETURNING id, name, email, role, is_super_admin, created_at, updated_at;
    `;
    values.push(id);

    const result = await pool.query(query, values);
    return result.rows[0] || null;  // Return null if admin not found
  }

  // Delete an admin (soft delete)
  async deleteAdmin(id: string) {
    const query = 'UPDATE admins SET is_deleted = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id';
    const values = [id];

    const result = await pool.query(query, values);
    return result.rowCount > 0;  // Return true if the admin was deleted
  }
}

export default new AdminService();
