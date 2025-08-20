"use client";

//* React
import { useState } from "react";
import { redirect } from "next/navigation";

//* Components
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";

//* Image
import Logo from "@/assets/clinica.png";

//* Model
import { UserModel } from "@/models/user.model";

//* Types
import { RegisterPayload } from "@/types/user.types";

export default function Register() {
    const userModel = new UserModel();

    const [role, setRole] = useState<"Medico" | "Paciente" | "">("");
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!name || !email || !password || !role || (role == "Medico" && !description)) {
            toast.error("Favor preencher todos os campos", { style: { backgroundColor: "#ff4d4f", color: "white", fontWeight: 500 } });
            return;
        }

        const payload: RegisterPayload = {
            Name: name,
            Email: email,
            Password: password,
            Role: role,
            Description: description
        };

        const response = await userModel.register(payload);
        if ("error" in response) {
            toast.error(response.error, { style: { backgroundColor: "#ff4d4f", color: "white", fontWeight: 500 } });
        } else {
            toast.success("Cadastro Realizado com sucesso");
            redirect('/login');
        }
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen w-full bg-[#03bb85]">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
                <div className="flex justify-center mb-6">
                    <Image src={Logo} alt="Logo" className="w-24 h-24" />
                </div>

                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Criar Conta
                </h1>

                <input placeholder="Nome" required type="text" className="main-input" value={name} onChange={(e) => setName(e.target.value)}/>
                <input placeholder="E-mail" required type="email" className="main-input mt-4" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <input placeholder="Senha" required type="password" className="main-input mt-4" value={password} onChange={(e) => setPassword(e.target.value)}/>

                <div className="mt-6">
                    <span className="block text-lg font-semibold text-[#03bb85] tracking-wide mb-3">
                        Selecione sua função
                    </span>

                    <div className="flex gap-4">
                        <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer transition hover:shadow-md w-full justify-center">
                            <input type="radio" name="role" value="Medico" checked={role === "Medico"} onChange={() => setRole("Medico")} className="w-5 h-5 accent-[#03bb85] cursor-pointer"/>
                            <span className="text-gray-700 font-medium">Médico</span>
                        </label>

                        <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer transition hover:shadow-md w-full justify-center">
                            <input type="radio" name="role" value="Paciente" checked={role === "Paciente"} onChange={() => setRole("Paciente")} className="w-5 h-5 accent-[#03bb85] cursor-pointer"/>
                            <span className="text-gray-700 font-medium">Paciente</span>
                        </label>
                    </div>
                </div>

                {role === "Medico" && ( <textarea placeholder="Descrição (Escreva suas especialidades)" className="main-input mt-4 min-h-[100px] resize-y" value={description} onChange={(e) => setDescription(e.target.value)}/> )}

                <button type="submit" className="main-button mt-6">
                    Registrar
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Já tem conta?&nbsp;
                    <a href="/login" className="text-[#03bb85] hover:underline font-medium">
                        Entrar
                    </a>
                </p>
                <ToastContainer
                    position="bottom-center"
                    autoClose={3000}
                    hideProgressBar
                    closeOnClick
                    pauseOnHover
                    draggable 
                    theme="colored" 
                    toastStyle={{ backgroundColor: "#03bb85", color: "white", fontWeight: 500, borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.15)" }}/>
            </form>
        </div>
    );
}
