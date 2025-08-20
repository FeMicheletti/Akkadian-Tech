"use client";

//* React
import React, { useEffect, useMemo, useState, useCallback } from "react";

//* Components
import Header from "@/components/header.component";
import { toast, ToastContainer } from "react-toastify";

//* Models
import { UserModel } from "@/models/user.model";
import { SchedulingModel } from "@/models/scheduling.model";

//* Types
import { Scheduling, SchedulingPayload } from "@/types/scheduling.types";

export default function Agendamento() {
    const schedulingModel = useMemo(() => new SchedulingModel(), []);

    const [isMedico, setIsMedico] = useState<boolean>(false);
    const [expanded, setExpanded] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [novaData, setNovaData] = useState<string>("");
    const [novaDescricao, setNovaDescricao] = useState<string>("");
    const [creating, setCreating] = useState(false);
    const [agendamentos, setAgendamentos] = useState<Scheduling[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== "undefined") setIsMedico(UserModel.isMedico);
    }, []);

    const fetchAgendamentos = useCallback(async (date?:string) => {
        setLoading(true);
        try {
            const response = await schedulingModel.getScheduling(date);

            if ("agendamentos" in response) {
                setAgendamentos(response.agendamentos);
            } else {
                toast.error(response.error, { style: { backgroundColor: "#ff4d4f", color: "white", fontWeight: 500 } });
            }
        } catch (error) {
            console.error("Erro ao carregar agendamentos:", error);
        } finally {
            setLoading(false);
        }
    }, [schedulingModel]);

    useEffect(() => {
        fetchAgendamentos();
    }, [fetchAgendamentos]);

    const createScheduling = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!novaData || !novaDescricao) {
            toast.error("Favor preencher todos os campos", { style: { backgroundColor: "#ff4d4f", color: "white", fontWeight: 500 } });
            return;
        }

        setCreating(true);

        const payload: SchedulingPayload = {
            Date: novaData,
            Description: novaDescricao
        };

        try {
            await schedulingModel.postScheduling(payload);
            fetchAgendamentos(); 
            setNovaData(""),
            setNovaDescricao("");
            setIsOpen(false);
        } catch (error) {
            console.error("Erro ao criar agendamento:", error);
            toast.error("Erro ao criar agendamento", { style: { backgroundColor: "#ff4d4f", color: "white", fontWeight: 500}});
        } finally {
            setCreating(false);
        }
    };

    const changeDate = (date:string) => {
        fetchAgendamentos(date);
        setNovaData(date);
    }

    const handleCancel = () => {
        setIsOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Header/>

            <main className="max-w-5xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Agendamentos</h1>
                    {!isMedico ? ( 
                        <button onClick={() => setIsOpen(true)} className="text-white bg-[#03bb85] hover:bg-[#02996d] font-bold px-4 py-2 rounded-lg shadow-md transition">
                            +
                        </button>) :
                        <input type="date" value={novaData} onChange={(e) => changeDate(e.target.value)} className="main-date"/>}
                </div>

                {loading ? 
                    <p className="text-center text-gray-500">Carregando agendamentos...</p> :
                    (agendamentos.length == 0 ?
                        <p className="text-center text-gray-500">Nenhum agendamento.</p> :
                        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#03bb85] text-white">
                                        <th className="p-4 text-center">Paciente</th>
                                        <th className="p-4 text-center">Médico</th>
                                        <th className="p-4 text-center">Data</th>
                                        <th className="p-4 text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {agendamentos.map((item) => (
                                        <React.Fragment key={item.id}>
                                            <tr className="hover:bg-gray-50 transition">
                                                <td className="p-4 border-b text-center">{item.userId}</td>
                                                <td className="p-4 border-b text-center">{item.doctorId ?? "Sem Médico"}</td>
                                                <td className="p-4 border-b text-center">{new Date(item.date).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }).replace(",", "")}</td>
                                                <td className="p-4 border-b text-center">
                                                    <button className="text-[#03bb85] font-medium hover:underline" onClick={() => setExpanded(expanded === item.id ? null : item.id) } >
                                                        {expanded === item.id ? "Fechar" : "Ver mais"}
                                                    </button>
                                                </td>
                                            </tr>
                                            {expanded === item.id && (
                                                <tr>
                                                    <td colSpan={4} className="p-4 bg-gray-50 border-b text-gray-700">
                                                        {item.description}
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>)}
            </main>

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>

                    <form onSubmit={createScheduling} className="relative bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Novo Agendamento</h2>

                        <label className="block mb-2 font-medium">Data</label>
                        <input type="datetime-local" value={novaData} onChange={(e) => setNovaData(e.target.value)} className="main-input mb-4" required={true}/>

                        <label className="block mb-2 font-medium">Descrição</label>
                        <textarea placeholder="Descreva seus sintomas" value={novaDescricao} onChange={(e) => setNovaDescricao(e.target.value)} className="main-input mb-4 min-h-[80px] resize-y" required={true}/>

                        <div className="flex justify-end gap-3">
                            <button onClick={handleCancel} className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition" >
                                Cancelar
                            </button>
                            <button type="submit" disabled={creating} className="px-4 py-2 rounded-lg bg-[#03bb85] text-white font-semibold hover:bg-[#02996d] transition" >
                                {creating ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox ="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                    </svg>
                                ) : "Salvar"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <ToastContainer
                position="bottom-center"
                autoClose={3000}
                hideProgressBar
                closeOnClick
                pauseOnHover
                draggable 
                theme="colored" 
                toastStyle={{ backgroundColor: "#03bb85", color: "white", fontWeight: 500, borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.15)" }}/>
        </div>
    );
}
