import { run } from '../src/db';

(async () => {
  try {
    await run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        gameId TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('STUDENT', 'VISITOR')),
        class TEXT,
        age INTEGER,
        createdAt TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `);
    await run(`
    CREATE TABLE IF NOT EXISTS ranking (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      timeMs INTEGER NOT NULL,
      score INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

    console.log('Migração executada com sucesso.');
    process.exit(0);
  } catch (e) {
    console.error('Falha na migração:', e);
    process.exit(1);
  }
})();
