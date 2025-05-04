import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import AnimatedLogin from "@/components/ui/animatedLogin.tsx";

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();

    return (
        <div>
            <button onClick={() => loginWithRedirect()}
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