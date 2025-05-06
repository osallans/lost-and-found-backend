import { pool } from "../../utils/db";


class ItemService {
  async createItem(itemData: { title: string; description: string; status: string; facility_id: string; reported_by: string }) {
    const { title, description, status, facility_id, reported_by } = itemData;

    const query = `
      INSERT INTO items (title, description, status, facility_id, reported_by, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id, title, description, status, facility_id, reported_by, created_at, updated_at;
    `;
    const values = [title, description, status, facility_id, reported_by];

    const [rows]: [any[], any] = await pool.query(query, values);
    return rows[0];
  }

  async getItemById(id: string) {
    const query = 'SELECT * FROM items WHERE id = ? AND is_deleted = false';
    const values = [id];

    const [rows]: [any[], any] = await pool.query(query, values);
    return rows[0] || null;
  }

  async updateItem(id: string, itemData: { title?: string; description?: string; status?: string }) {
    const fields = [];
    const values = [];

    if (itemData.title) {
      fields.push('title = ?');
      values.push(itemData.title);
    }
    if (itemData.description) {
      fields.push('description = ?');
      values.push(itemData.description);
    }
    if (itemData.status) {
      fields.push('status = ?');
      values.push(itemData.status);
    }

    const query = `
      UPDATE items
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      RETURNING id, title, description, status, facility_id, reported_by, created_at, updated_at;
    `;
    values.push(id);

    const [rows]: [any[], any] = await pool.query(query, values);
    return rows[0] || null;
  }

  async deleteItem(id: string) {
    const query = 'UPDATE items SET is_deleted = true, updated_at = CURRENT_TIMESTAMP WHERE id = ? RETURNING id';
    const values = [id];

    const [rows]: [any[], any] = await pool.query(query, values);
    return rows.length > 0;
  }
}

export default new ItemService();