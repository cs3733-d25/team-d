import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();

    return (
        <div className="border-4 border-white rounded-full text-center bg-black/30 hover:bg-black/60 text-white animate-in fade-in zoom-in duration-800 p-4">
            <button onClick={() => loginWithRedirect()} className="font-nunito text-xl">LOGIN</button>
        </div>
    )
};

export default LoginButton;