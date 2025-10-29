import { run } from '../src/db';

(async () => {
    try {
        await run(`INSERT INTO todos (title, done) VALUES (?, ?)`, ['Estudar Node 16 + TS', 0]);
        await run(`INSERT INTO todos (title, done) VALUES (?, ?)`, ['Criar API com SQLite', 0]);
        console.log('Seed inserido.');
        process.exit(0);
    } catch (e) {
        console.error('Falha no seed:', e);
        process.exit(1);
    }
})();
