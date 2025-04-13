import React from 'react';


import Login from "@/components/Login.tsx";
import HeroTextBox from "@/components/HeroPage.tsx";
import AccessDropMenu from "@/components/accessibility.tsx";
import Banner from "@/components/Banner.tsx";
import Auth0LoginButton from "@/components/Auth0LoginButton.tsx";

export default function Home() {
    return (
        <>
            <div className="object-left bg-[url(../public/Hospital.jpg)] bg-no-repeat bg-cover h-screen p-10 overflow-y-hidden flex flex-row ">


                {/*This is the call of the component HeroTextBox for the home page*/}
                <div className="">
                    <HeroTextBox />
                </div>

                <div className="w-50 ">
                    <Auth0LoginButton />
                </div>




            </div>
        </>
    );
}
