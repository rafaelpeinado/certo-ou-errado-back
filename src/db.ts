import { Pool } from 'pg';
import dotenv from 'dotenv';
import { DatabaseResult } from './types';
dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER || 'appuser',
    password: process.env.DB_PASSWORD || 'appsecret',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'certo_ou_errado'
});

pool.on('connect', () => {
    console.log('PostgreSQL conectado');
});

pool.on('error', (err) => {
    console.error('Erro no PostgreSQL:', err);
    process.exit(1);
});

export const db = pool;

export async function run<T = any>(sql: string, params: unknown[] = []): Promise<DatabaseResult<T>> {
    const result = await pool.query(sql, params);
    return {
        changes: result.rowCount || 0,
        lastID: result.rows[0]?.id,
        rows: result.rows
    };
}

export async function get<T = any>(sql: string, params: unknown[] = []) {
    const result = await pool.query(sql, params);
    return result.rows[0] as T | undefined;
}

export async function all<T = any>(sql: string, params: unknown[] = []) {
    const result = await pool.query(sql, params);
    return result.rows as T[];
}
