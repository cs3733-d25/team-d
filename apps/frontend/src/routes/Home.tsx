import React from 'react';


import Login from "@/components/Login.tsx";
import HeroTextBox from "@/components/HeroPage.tsx";
import AccessDropMenu from "@/components/accessibility.tsx";
import Banner from "@/components/Banner.tsx";
import Auth0LoginButton from "@/components/Auth0LoginButton.tsx";
import MapButton from "@/components/MapButton.tsx";
import DirectoryButton from "@/components/DirectoryButton.tsx";
import Footer from "@/components/Footer.tsx";

// Use for comments
{/**/}

export default function Home() {
    return (
        <div>
            <div className="object-left bg-[url(../public/Hospital.jpg)] bg-no-repeat bg-cover h-screen filter saturate-200 flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-yellow-600/10 mix-blend-multiply pointer-events-none"></div>
                <div className="absolute inset-0 bg-zinc-900/50 pointer-events-none"></div>

                <div className="relative z-10 pb-10">
                    <HeroTextBox />
                </div>

                <div className="relative z-10 flex flex-row justify-around w-full max-w-4xl p-4">
                    {/*This is the call of the component HeroTextBox for the home page*/}
                    <div className="w-40">
                        <Auth0LoginButton />
                    </div>
                    <div className="w-40">
                        <MapButton />
                    </div>

                    <div className="w-40">
                        <DirectoryButton />
                    </div>
                </div>

            <div className="place">
                <Footer />
            </div>
            </div>
        </div>
    );
}
