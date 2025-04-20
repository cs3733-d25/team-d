import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
    const { logout } = useAuth0();

    return (
        <div className="ml-auto p-2 text-base hover:bg-[rgba(0,31,63,0.8)] hover:text-white cursor-pointer">
            <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                Log Out
            </button>
        </div>
    );
};
//

export default LogoutButton;