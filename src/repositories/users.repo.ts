import { all, get, run } from '../db';
import type { User } from '../types';

export async function listUsers(): Promise<User[]> {
    return all<User>(`SELECT * FROM users ORDER BY id DESC`);
}

export async function getUserById(id: number): Promise<User | undefined> {
    return get<User>(`SELECT * FROM users WHERE id = ?`, [id]);
}

export async function getUser(user: User): Promise<User | undefined> {
    return get<User>(`SELECT * FROM users WHERE age = ? AND name = ? AND role = ? AND class = ?`, [user.age, user.name, user.role, user.class]);
}

export async function createUser(input: {
    name: string;
    role: 'STUDENT' | 'VISITOR';
    age: number;
    class?: string;
}): Promise<User> {

    const res = await run(
        `INSERT INTO users (name, gameId, role, class, age)
     VALUES (?, ?, ?, ?, ?)`,
        [input.name, genUserId(input.name), input.role, input.class ?? null, input.age]
    );

    const created = await getUserById(res.lastID);
    if (!created) throw new Error('Falha ao recuperar usuário criado');
    return created;
}

export async function updateUser(
    id: number,
    input: Partial<Omit<User, 'id' | 'createdAt' | 'updated_at'>>
): Promise<User | undefined> {
    const fields: string[] = [];
    const params: unknown[] = [];

    if (typeof input.name === 'string') {
        fields.push('name = ?');
        params.push(input.name);
    }
    if (typeof input.role === 'string') {
        fields.push('role = ?');
        params.push(input.role);
    }
    if (typeof input.class === 'string') {
        fields.push('class = ?');
        params.push(input.class);
    }
    if (typeof input.age === 'number') {
        fields.push('age = ?');
        params.push(input.age);
    }

    fields.push(`updated_at = datetime('now')`);

    if (fields.length > 0) {
        params.push(id);
        await run(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, params);
    }

    return getUserById(id);
}

export async function deleteUser(id: number): Promise<boolean> {
    const res = await run(`DELETE FROM users WHERE id = ?`, [id]);
    return res.changes > 0;
}

function genUserId(name: string) {
  const letters = name.trim().substring(0,2).toUpperCase();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let rand = '';
  for (let i = 0; i < 5; i++) rand += chars[Math.floor(Math.random() * chars.length)];
  return letters + rand;
}
