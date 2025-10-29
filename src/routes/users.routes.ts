import { Router } from 'express';
import * as repo from '../repositories/users.repo';

const router = Router();

router.get('/', async (_req, res, next) => {
    try {
        res.json(await repo.listUsers());
    } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
    try {
        const user = await repo.getUserById(Number(req.params.id));
        if (!user) return res.status(404).json({ message: 'Não encontrado' });
        res.json(user);
    } catch (e) { next(e); }
});

router.post('/user', async (req, res, next) => {
    try {
        const user = await repo.getUser(req.body);
        res.status(200).json(user);
    } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
    try {
        const { name, role, class: className, age } = req.body;
        if (!name || !role) {
            return res.status(400).json({ message: 'name e role são obrigatórios' });
        }
        const user = await repo.createUser({
            name,
            role,
            class: className,
            age,
        });
        res.status(201).json(user);
    } catch (e) { next(e); }
});

router.patch('/:id', async (req, res, next) => {
    try {
        const user = await repo.updateUser(Number(req.params.id), req.body);
        if (!user) return res.status(404).json({ message: 'Não encontrado' });
        res.json(user);
    } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const ok = await repo.deleteUser(Number(req.params.id));
        if (!ok) return res.status(404).json({ message: 'Não encontrado' });
        res.status(204).send();
    } catch (e) { next(e); }
});

export default router;
