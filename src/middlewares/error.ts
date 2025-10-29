import { Request, Response, NextFunction } from 'express';

export function errorMiddleware(err: any, _req: Request, res: Response, _next: NextFunction) {
    console.error(err);
    res.status(err?.status || 500).json({
        error: true,
        message: err?.message || 'Erro interno do servidor'
    });
}
