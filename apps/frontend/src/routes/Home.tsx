import React from 'react';
import AnimatedLogin from "@/components/ui/animatedLogin.tsx";
import AnimatedMap from "@/components/ui/animatedMap.tsx";
import AnimatedService from "@/components/ui/animatedService.tsx";
import HeroTextBox from "@/components/HeroPage.tsx";
import Auth0LoginButton from "@/components/Auth0LoginButton.tsx";
import MapButton from "@/components/MapButton.tsx";
import Footer from "@/components/Footer.tsx";
import { useAuth0 } from "@auth0/auth0-react";
import DisclaimerBar from "@/components/DisclaimerBar.tsx";
import ServiceRequestbutton from "@/components/ServiceRequestbutton.tsx";
// import {useNavigate} from "react-router-dom";

// Use for comments
{/**/}

// Placeholder for animated icons
const AnimatedIcon = () => <div className="w-8 h-8 bg-blue-500 rounded-full animate-bounce"></div>;

export default function Home() {
    const { user, isAuthenticated, isLoading } = useAuth0();

    return (
        <div>
            <div className="sticky top-0 z-30">
                <DisclaimerBar/>
            </div>
            <div className="grid grid-rows-[auto_1fr_auto] w-full min-h-screen overflow-hidden">

                {/* Hero Section */}
                <div className="relative grid w-full h-screen items-center justify-center">
                    {/* Background Layer */}
                    <div className="absolute inset-0 bg-[url(../public/Hospital.jpg)] bg-cover bg-center bg-no-repeat h-screen filter saturate-200 flex flex-col items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-yellow-600/10 mix-blend-multiply pointer-events-none"></div>
                        <div className="absolute inset-0 bg-zinc-900/50 pointer-events-none"></div>
                        {/* Hero Text */}
                        <div className="relative z-10 pb-10 items-center gap-6 text-center top-[-35vh]">
                            <HeroTextBox/>
                        </div>
                    </div>

                    {/* Content Layer */}
                    <div className="relative z-10 pb-10 items-center gap-6 text-center">


                        {/* Buttons Section */}

                        <div className="relative z-10 flex justify-center items-center h-full w-full">
                            <div className="relative flex flex-row w-full  items-center justify-center gap-10">
                                {!isAuthenticated && (
                                    <div className="w-[250px] h-[250px]">
                                        <Auth0LoginButton/>
                                    </div>
                                )}
                                {/* Map Section - Purple Box */}
                                <div className=" w-[250px] h-[250px] bg-[#F1F1F1] rounded-t-lg border-white">
                                    {/* Animated Map */}
                                    <div className="flex-grow flex items-center justify-center w-full">
                                        <AnimatedMap/>
                                    </div>

                                    <MapButton/>
                                </div>

                                {/* Directory Button */}

                                <div className=" w-[250px] h-[250px] bg-[#F1F1F1] rounded-t-lg border-white">
                                    {/* Animated Map */}
                                    <div className="flex-grow flex items-center justify-center w-full">
                                        <AnimatedService/>
                                    </div>

                                    <ServiceRequestbutton/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="w-full">
                    <Footer/>
                </div>
            </div>
        </div>
    );
}
