import { all, get, run } from '../db';
import type { Ranking } from '../types';

export async function listRanking(): Promise<Ranking[]> {
    return all<any>(`
    SELECT
      ranking.id,
      ranking.user_id AS "userId",
      ranking.time_ms AS "timeMs",
      ranking.score,
      ranking.created_at as "createdAt",
      users.name,
      users.role,
      users.class,
      users.age,
      users.game_id as "gameId"
    FROM ranking
    JOIN users ON users.id = ranking.user_id
    ORDER BY ranking.score DESC, ranking.time_ms ASC
  `);
}

export async function getRanking(id: number): Promise<Ranking | undefined> {
    return get<any>(`
        SELECT 
            id,
            user_id AS "userId",
            time_ms AS "timeMs",
            score,
            created_at as "createdAt"
        FROM ranking 
        WHERE id = $1`, [id]);
}

export async function getRankingByUserId(userId: number): Promise<Ranking | undefined> {
    return get<any>(`
        SELECT 
            id,
            user_id AS "userId",
            time_ms AS "timeMs",
            score,
            created_at as "createdAt"
        FROM ranking 
        WHERE user_id = $1`, [userId]);
}

export async function createRanking(data: { userId: number; timeMs: number; score: number; }): Promise<Ranking> {
    const res = await run(
        `INSERT INTO ranking (user_id, time_ms, score)
     VALUES ($1, $2, $3)
     RETURNING id`,
        [data.userId, data.timeMs, data.score]
    );

    const created = await getRanking(res.rows[0].id);
    if (!created) throw new Error('Falha ao criar ranking');
    return created;
}

export async function deleteRanking(id: number): Promise<boolean> {
    const res = await run(`DELETE FROM ranking WHERE id = $1`, [id]);
    return res.changes > 0;
}
