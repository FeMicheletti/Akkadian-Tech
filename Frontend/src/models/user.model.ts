//* Types
import { ErrorResponse } from "@/types/general.types";
import { LoginPayload, LoginResponse, RegisterPayload, User } from "@/types/user.types";

export class UserModel {
    private baseUrl: string;

    constructor() {
        // URL base do backend definida no .env
        this.baseUrl = process.env.API_URL || "http://localhost:5000";
    }

    /**
     *  Função de login
     *  
     *  @param payload Email e Password
     *  @returns Promise<LoginResponse | ErrorResponse>
     */
    async login(payload: LoginPayload): Promise<LoginResponse | ErrorResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData: ErrorResponse = await response.json();
                return errorData;
            }

            const data: LoginResponse = await response.json();

            return data;
        } catch (error) {
            console.error("Login error:", error);
            return {error: "Ocorreu algum erro. Favor tentar novamente."};
        }
    }

    /**
     *  Função de Registro
     *  
     *  @param payload Nome, Email, Senha, Cargo e Descrição
     *  @returns Promise<User | ErrorResponse>
     */
    async register(payload: RegisterPayload): Promise<User | ErrorResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData: ErrorResponse = await response.json();
                return errorData;
            }

            const data: User = await response.json();
            return data;
        } catch (error) {
            console.error("Login error:", error);
            return {error: "Ocorreu algum erro. Favor tentar novamente."};
        }
    }

    /**
     *  Função que retorna se usuário é Médico
     *  
     *  @returns boolean
     */
    static isMedico():boolean {
        return localStorage.getItem("role") == "Medico";
    }

    /**
     *  Função que id do usuário
     *  
     *  @returns number
     */
    static getUserId():number {
        return Number(localStorage.getItem("userId"));
    }
}
