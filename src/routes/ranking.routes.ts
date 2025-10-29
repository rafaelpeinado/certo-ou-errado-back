import { Router } from 'express';
import * as repo from '../repositories/ranking.repo';

const router = Router();

router.get('/', async (_req, res, next) => {
    try {
        res.json(await repo.listRanking());
    } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
    try {
        const item = await repo.getRanking(Number(req.params.id));
        if (!item) return res.status(404).json({ message: 'Não encontrado' });
        res.json(item);
    } catch (e) { next(e); }
});

router.get('/user/:userId', async (req, res, next) => {
    try {
        const item = await repo.getRanking(Number(req.params.userId));
        if (!item) return res.status(404).json({ message: 'Não encontrado' });
        res.json(item);
    } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
    try {
        const { userId, timeMs, score } = req.body;
        if (!userId || timeMs == null || score == null) {
            return res.status(400).json({
                message: 'userId, timeMs e score são obrigatórios'
            });
        }
        const created = await repo.createRanking({ userId, timeMs, score });
        res.status(201).json(created);
    } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const ok = await repo.deleteRanking(Number(req.params.id));
        if (!ok) return res.status(404).json({ message: 'Não encontrado' });
        res.status(204).send();
    } catch (e) { next(e); }
});

export default router;
