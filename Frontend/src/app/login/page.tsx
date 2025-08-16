"use client";

//* React
import { useState } from "react";

//* Components
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";

//* Images
import Logo from "@/assets/clinica.png"

//* Model
import { UserModel } from "@/models/user.model";

//* Types
import { LoginPayload } from "@/types/user.types";

export default function Login() {
    const userModel = new UserModel();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload: LoginPayload = {
            Email: email,
            Password: password,
        };

        const response = await userModel.login(payload);
        if ("error" in response) {
            toast.error(response.error, { style: { backgroundColor: "#ff4d4f", color: "white", fontWeight: 500 } });
        } else {
            localStorage.setItem("token", response.token);
            localStorage.setItem("userId", (response.userId).toString());
            localStorage.setItem("role", response.role);
            location.href = "/agendamento";
        }
    };

	return (
        <div className="flex flex-col justify-center items-center h-screen w-full">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
                <div className="flex justify-center mb-6">
                    <Image src={Logo} alt="Logo" className="w-24 h-24" />
                </div>

                <input placeholder="E-mail" required type="email" className="main-input" value={email} onChange={(e) => setEmail(e.target.value)}/>

                <input placeholder="Senha" required type="password" className="main-input mt-4" value={password} onChange={(e) => setPassword(e.target.value)}/>

                <button type="submit" className="w-full mt-6 bg-[#03bb85] hover:bg-[#02996d] text-white font-semibold py-2 rounded-lg transition duration-200 shadow-md">
                    Entrar
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Ainda não tem conta?&nbsp;
                    <a href="/register" className="text-[#03bb85] hover:underline font-medium">
                        Cadastrar
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