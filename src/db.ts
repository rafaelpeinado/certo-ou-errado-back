import path from 'path';
import fs from 'fs';
import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';
dotenv.config();

const dbFile = process.env.DB_FILE || './data/app.sqlite';
const dbDir = path.dirname(dbFile);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

sqlite3.verbose();
export const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('Erro ao abrir SQLite:', err);
        process.exit(1);
    } else {
        console.log('SQLite conectado em', dbFile);
    }
});

export function run(sql: string, params: unknown[] = []) {
    return new Promise<{ changes: number; lastID: number }>((resolve, reject) => {
        db.run(sql, params, function (this: sqlite3.RunResult, err) {
            if (err) return reject(err);
            resolve({ changes: this.changes, lastID: this.lastID });
        });
    });
}

export function get<T = any>(sql: string, params: unknown[] = []) {
    return new Promise<T | undefined>((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) return reject(err);
            resolve(row as T | undefined);
        });
    });
}

export function all<T = any>(sql: string, params: unknown[] = []) {
    return new Promise<T[]>((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) return reject(err);
            resolve(rows as T[]);
        });
    });
}
