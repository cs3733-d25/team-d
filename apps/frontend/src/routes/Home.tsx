import React from 'react';


import HeroTextBox from "@/components/HeroPage.tsx";
import AccessDropMenu from "@/components/accessibility.tsx";
import Auth0LoginButton from "@/components/Auth0LoginButton.tsx";
import Footer from "@/components/Footer.tsx";

// Use for comments
{/**/}

export default function Home() {
    return (
        <>
            <div className="object-left bg-[url(../public/Hospital.jpg)] bg-no-repeat bg-cover h-screen p-10 overflow-y-hidden flex flex-row ">



                {/*This is the call of the component HeroTextBox for the home page*/}
                <div className="">
                    <HeroTextBox />
                </div>

                <div className="w-40">
                    <Auth0LoginButton />
                </div>


            </div>

            <div className="place">
                <Footer />
            </div>

        </>
    );
}
