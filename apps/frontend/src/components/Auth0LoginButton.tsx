import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import AnimatedLogin from "@/components/ui/animatedLogin.tsx";

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();

    return (
        <div className="">
            <button onClick={() => loginWithRedirect()}
                    className="flex flex-col items-center border-4 w-65 rounded-lg border-white text-center bg-black/30 hover:bg-black/60 text-white animate-in fade-in zoom-in duration-500 font-nunito hover:scale-110 cursor-pointer"
            >
                <div className="bg-white border-white w-full">
                    <AnimatedLogin/>
                </div>

                <div className="p-4 w-full">
                    LOGIN
                </div>
            </button>
        </div>
    )
};

export default LoginButton;