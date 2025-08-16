//* Types
import { ErrorResponse } from "@/types/general.types";
import { SchedulingCreateResponse, SchedulingPayload, SchedulingResponse } from "@/types/scheduling.types";

//* Models
import { UserModel } from "./user.model";

export class SchedulingModel {
    private baseUrl: string;

    constructor() {
        // URL base do backend definida no .env
        this.baseUrl = process.env.API_URL || "http://localhost:5000";
    }

    /**
     *  Função que retorna agendamento
     *  
     *  @returns Promise<User | ErrorResponse>
     */
    async getScheduling(date?:string): Promise<SchedulingResponse | ErrorResponse> {
        let url = "/paciente/agendamentos";
        if (UserModel.isMedico()) url = "/medico/agendamentos";

        if (date) url += `?date=${date}`

        try {
            const response = await fetch(`${this.baseUrl}${url}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok) {
                let errorData: ErrorResponse = { error: "Erro desconhecido" };
                try {
                    const text = await response.text();
                    if (text) errorData = JSON.parse(text);
                } catch {}
                return errorData;
            }

            const data: SchedulingResponse = await response.json();
            return data;
        } catch (error) {
            console.error("Login error:", error);
            return {error: "Ocorreu algum erro. Favor tentar novamente."};
        }
    }

    /**
     *  Função que cria um agendamento
     *  
     *  @param payload Data e Descrição
     *  @returns Promise<User | ErrorResponse>
     */
    async postScheduling(payload: SchedulingPayload): Promise<SchedulingCreateResponse | ErrorResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/paciente/agendamentos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData: ErrorResponse = await response.json();
                return errorData;
            }

            const data: SchedulingCreateResponse = await response.json();

            await fetch(`${this.baseUrl}/mock/triagem?id=${data.agendamento.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            return data;
        } catch (error) {
            console.error("Login error:", error);
            return {error: "Ocorreu algum erro. Favor tentar novamente."};
        }
    }

}