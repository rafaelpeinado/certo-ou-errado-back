import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import usersRoutes from './routes/users.routes';
import rankingRoutes from './routes/ranking.routes';
import { errorMiddleware } from './middlewares/error';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// habilitar CORS antes das rotas
app.use(cors({
    origin: 'https://certo-ou-errado-front.onrender.com',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
}));

app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/users', usersRoutes);
app.use('/ranking', rankingRoutes);

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
});
