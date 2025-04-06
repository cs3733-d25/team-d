import React from 'react';


import Login from "@/components/Login.tsx";
import HeroTextBox from "@/components/HeroPage.tsx";
import {ServiceRequestPopup} from "@/components/ServiceRequestPopup.tsx";

export default function Home() {
    return (
        <>
            <div className="object-left bg-[url(../public/Hospital.jpg)] bg-no-repeat bg-cover h-screen p-10 overflow-y-hidden flex flex-row ">

                {/*This is the call of the component HeroTextBox for the home page*/}
                <div className="flex-2/3 place-content-center">
                    <HeroTextBox />
                </div>

                {/*This is the call of the component login for the home page*/}
                <div className="w-200 place-content-center">
                    <Login />
                </div>

                <div className="w-100 place-content-top">
                    <ServiceRequestPopup />
                </div>
            </div>
        </>
    );
}
