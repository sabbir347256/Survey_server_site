
export interface IUser {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'employee';
    balance: number;
    pendingBalance: number;
    status: 'active' | 'suspended';
    createdAt: Date;
    updatedAt: Date;
};