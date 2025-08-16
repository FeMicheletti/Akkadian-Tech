"use client";

//* React
import React, { useEffect, useState } from "react";

//* Components
import Header from "@/components/header.component";
import { toast, ToastContainer } from "react-toastify";

//* Models
import { UserModel } from "@/models/user.model";
import { SchedulingModel } from "@/models/scheduling.model";

//* Types
import { Scheduling, SchedulingPayload } from "@/types/scheduling.types";

export default function Agendamento() {
    const schedulingModel = new SchedulingModel();

    const [isMedico, setIsMedico] = useState<boolean>(false);
    const [expanded, setExpanded] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [novaData, setNovaData] = useState<string>("");
    const [novaDescricao, setNovaDescricao] = useState<string>("");

    const [agendamentos, setAgendamentos] = useState<Scheduling[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== "undefined") setIsMedico(UserModel.isMedico);
    }, []);

    useEffect(() => {
        const fetchAgendamentos = async () => {
            try {
                const response = await schedulingModel.getScheduling();

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
        };

        fetchAgendamentos();
    }, []);

    const createScheduling = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload: SchedulingPayload = {
            Date: novaData,
            Description: novaDescricao
        };

        schedulingModel.postScheduling(payload);
        location.reload();
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
                        <input type="date" value={novaData} onChange={(e) => setNovaData(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03bb85] focus:border-transparent text-gray-800; mb-4"/>}
                </div>

                {loading ? 
                    <p className="text-center text-gray-500">Carregando agendamentos...</p> :
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
                                            <td className="p-4 border-b text-center">{item.date}</td>
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
                    </div>}
            </main>

            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>

                    <form onSubmit={createScheduling} className="relative bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Novo Agendamento</h2>

                        <label className="block mb-2 font-medium">Data</label>
                        <input type="datetime-local" value={novaData} onChange={(e) => setNovaData(e.target.value)} className="main-input mb-4" required={true}/>

                        <label className="block mb-2 font-medium">Descrição</label>
                        <textarea placeholder="Descreva oque está sentindo" value={novaDescricao} onChange={(e) => setNovaDescricao(e.target.value)} className="main-input mb-4 min-h-[80px] resize-y" required={true}/>

                        <div className="flex justify-end gap-3">
                            <button onClick={() => location.reload()} className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition" >
                                Cancelar
                            </button>
                            <button type="submit" className="px-4 py-2 rounded-lg bg-[#03bb85] text-white font-semibold hover:bg-[#02996d] transition" >
                                Salvar
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
