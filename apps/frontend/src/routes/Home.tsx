import React from 'react';
import AnimatedLogin from "@/components/ui/animatedLogin.tsx";
import AnimatedMap from "@/components/ui/animatedMap.tsx";
import AnimatedService from "@/components/ui/animatedService.tsx";
import HeroTextBox from "@/components/HeroPage.tsx";
import Auth0LoginButton from "@/components/Auth0LoginButton.tsx";
import MapButton from "@/components/MapButton.tsx";
import DirectoryButton from "@/components/DirectoryButton.tsx";
import Footer from "@/components/Footer.tsx";
import { useAuth0 } from "@auth0/auth0-react";
import {useNavigate} from "react-router-dom";


// Placeholder for animated icons
const AnimatedIcon = () => <div className="w-8 h-8 bg-blue-500 rounded-full animate-bounce"></div>;

export default function Home() {
    const { user, isAuthenticated } = useAuth0();

    return (
        <div className="grid grid-rows-[auto_1fr_auto] w-full min-h-screen overflow-hidden">

            {/* Hero Section */}
            <div className="relative grid w-full h-screen items-center justify-center">

                {/* Background Layer */}
                <div className="absolute inset-0 bg-[url(../public/Hospital.jpg)] bg-cover bg-center bg-no-repeat">
                    <div className="absolute inset-0 bg-yellow-600/10 mix-blend-multiply pointer-events-none"></div>
                    <div className="absolute inset-0 bg-zinc-900/50 pointer-events-none"></div>
                </div>

                {/* Content Layer */}
                <div className="relative z-10 flex flex-col items-center gap-4 text-center">

                    {/* Hero Text */}
                    <div className="absolute top-[-35vh] left-1/2 transform -translate-x-1/2">
                        <HeroTextBox />
                    </div>

                    {/* Buttons Section */}

                    <div className="relative z-10 flex justify-center items-center h-full w-full px-12">
                        <div className="grid grid-cols-3 gap-16 max-w-4xl mx-auto">
                        <div className=" w-[250px] h-[250px] bg-[#F1F1F1] rounded-t-lg border-white">
                            <div className="flex-grow flex items-center justify-center w-full">
                                <AnimatedLogin />
                            </div>
                                <div>
                                    <Auth0LoginButton />
                                </div>)
                        </div>


                        {/* Map Section - Purple Box */}
                        <div className=" w-[250px] h-[250px] bg-[#F1F1F1] rounded-t-lg border-white">
                            {/* Animated Map */}
                            <div className="flex-grow flex items-center justify-center w-full">
                                <AnimatedMap />
                            </div>

                            <MapButton />
                        </div>




                        {/* Directory Button */}

                        <div className=" w-[250px] h-[250px] bg-[#F1F1F1] rounded-t-lg border-white">
                            {/* Animated Map */}
                            <div className="flex-grow flex items-center justify-center w-full">
                                <AnimatedService />
                            </div>

                            <DirectoryButton />
                        </div>
                            </div>

                </div>
            </div>
            </div>

            {/* Footer */}
            <div className="w-full">
                <Footer />
            </div>
        </div>
    );
}
