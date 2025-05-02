// src/utils/transactionManager.ts

import { pool } from './db'; // Adjust the path if needed
import mysql from 'mysql2/promise';

export async function runInTransaction(work: (conn: mysql.PoolConnection) => Promise<any>) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const result = await work(connection);

    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
