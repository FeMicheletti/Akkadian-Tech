"use client"

//* React
import { useState, useEffect } from "react";
import { redirect } from "next/navigation";

//* Components
import Image from "next/image"

//* Image
import Logo from "@/assets/clinica.png";

//* Icons
import { MdLogout } from "react-icons/md";

const Header: React.FC = () => {
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        const storedName = localStorage.getItem("name");
        if (storedName) setUserName(storedName);
    }, []);

    const userLoggout = ():void => {
        localStorage.clear();
        redirect('/login');
    }

    return(
        <header className="bg-[#03bb85] py-4 flex justify-center shadow-md">
            <Image src={Logo} alt="Logo" className="h-12 w-auto" />
            <div className="absolute right-10 self-center flex justify-center items-center gap-3 text-white font-bold">
                {userName}
                <MdLogout className="text-2xl text-red-700 cursor-pointer" onClick={userLoggout}/>
            </div>
        </header>
    )
}

export default Header;