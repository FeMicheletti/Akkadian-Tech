"use client"

//* React
import { useEffect } from "react";

//* Next
import { redirect, usePathname } from "next/navigation";

//* CSS
import "@/styles/global.css";

//* Type
import { LayoutProps } from "@/types/layout.types";

export default function RootLayout({ children }: LayoutProps) {
    const pathname = usePathname();

    useEffect(() => {
        const checkToken = async () => {
            if (pathname === "/register") return;

            const token = localStorage.getItem("token");
            if (!token) redirectLogin();

            try {
                var baseUrl = process.env.API_URL || "http://localhost:5000";;
                const res = await fetch(`${baseUrl}/auth/validation`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) redirectLogin();
            } catch (error) {
				redirectLogin();
            }
        };

		const redirectLogin = () => {
			localStorage.clear();
            redirect('/login');
		}

        checkToken();
    }, [pathname]);

	return (
		<html lang="pt">
			<head>
				<title>ClinicaAPP</title>
			</head>
			<body>
				{children}
			</body>
		</html>
	);
}