//* Components
import Image from "next/image"

//* Image
import Logo from "@/assets/clinica.png";

const Header: React.FC = () => {
    return(
        <header className="bg-[#03bb85] py-4 flex justify-center shadow-md">
            <Image src={Logo} alt="Logo" className="h-12 w-auto" />
        </header>
    )
}

export default Header;