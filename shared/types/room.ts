export interface IRoom {
    id: number;
    name: string;
    description: string;
    status: string;
    hasPassword: boolean;
    users: number;
    password?: string;
}