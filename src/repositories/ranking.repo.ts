import { all, get, run } from '../db';
import type { Ranking } from '../types';

export async function listRanking(): Promise<Ranking[]> {
    return all<any>(`
    SELECT
      ranking.id,
      ranking.userId,
      ranking.timeMs,
      ranking.score,
      users.name,
      users.role,
      users.class,
      users.age,
      users.gameId
    FROM ranking
    JOIN users ON users.id = ranking.userId
    ORDER BY ranking.score DESC, ranking.timeMs ASC
  `);
}

export async function getRanking(id: number): Promise<Ranking | undefined> {
    return get<any>(`SELECT * FROM ranking WHERE id = ?`, [id]);
}

export async function getRankingByUserId(userId: number): Promise<Ranking | undefined> {
    return get<any>(`SELECT * FROM ranking WHERE userId = ?`, [userId]);
}

export async function createRanking(data: { userId: number; timeMs: number; score: number; }): Promise<Ranking> {
    const res = await run(
        `INSERT INTO ranking (userId, timeMs, score)
     VALUES (?, ?, ?)`,
        [data.userId, data.timeMs, data.score]
    );

    const created = await getRanking(res.lastID);
    if (!created) throw new Error('Falha ao criar ranking');
    return created;
}

export async function deleteRanking(id: number): Promise<boolean> {
    const res = await run(`DELETE FROM ranking WHERE id = ?`, [id]);
    return res.changes > 0;
}
