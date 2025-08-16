export interface User {
    Id: number;
    Name: string;
    Email: string;
    Password: string;
    Role: string;
    Description: string;
}

export interface LoginPayload {
    Email: string;
    Password: string;
}

export interface LoginResponse {
    token: string;
    userId: number;
    role: string;
}

export interface RegisterPayload {
    Name: string;
    Email: string;
    Password: string;
    Role: string;
    Description: string;
}