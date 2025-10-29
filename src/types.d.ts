export type UserRole = 'STUDENT' | 'VISITOR';

export type User = {
    id: number;
    gameId: string;
    name: string;
    role: UserRole;
    class: string;
    age: number;
    createdAt: string;
};

export type Ranking = {
    id: number;
    userId: number;
    timeMs: number;
    score: number;
    createdAt: string;
};

