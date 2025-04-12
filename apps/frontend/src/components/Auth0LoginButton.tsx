import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();

    return (
        <div className="border-2 rounded-md text-center text-white animate-in fade-in zoom-in duration-800">
            <button onClick={() => loginWithRedirect()}>LOGIN</button>
        </div>
    )
};

export default LoginButton;