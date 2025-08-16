export interface Scheduling {
    id: number,
    userId: number,
    doctorId: number | null,
    description: string,
    date: string
}

export interface SchedulingPayload {
    Date: string,
    Description: string
}

export interface SchedulingResponse {
    agendamentos: {
        id: number,
        userId: number,
        doctorId: number | null,
        description: string,
        date: string
    }[];
}