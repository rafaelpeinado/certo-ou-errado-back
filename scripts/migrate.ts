import { run } from '../src/db';

(async () => {
  try {
    await run(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        game_id TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('STUDENT', 'VISITOR')),
        class TEXT,
        age INTEGER,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await run(`
    CREATE TABLE IF NOT EXISTS ranking (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      time_ms INTEGER NOT NULL,
      score INTEGER NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

    console.log('Migração executada com sucesso.');
    process.exit(0);
  } catch (e) {
    console.error('Falha na migração:', e);
    process.exit(1);
  }
})();
