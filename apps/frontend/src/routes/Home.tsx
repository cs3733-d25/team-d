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
        <div className="grid grid-rows-[auto_1fr_auto] w-full min-h-screen overflow-hidden">
            <div className="sticky top-0 z-30">
                <DisclaimerBar />
            </div>
            <div className="object-left bg-[url(../public/Hospital.jpg)] bg-no-repeat bg-cover h-screen filter saturate-200 flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-yellow-600/10 mix-blend-multiply pointer-events-none"></div>
                <div className="absolute inset-0 bg-zinc-900/50 pointer-events-none"></div>

                <div className="relative z-10 pb-10 flex flex-col items-center gap-6 text-center">
                    <HeroTextBox />
                </div>

                <div className="flex justify-left items-center w-full min-h-screen ">
                    <div className="relative flex flex-row w-full  items-center justify-center p-4 gap-10">
                        <div className=" w-[250px] h-[250px] bg-[#F1F1F1] border-white">
                            <div className="flex-grow flex items-center justify-center w-full">
                                <AnimatedLogin />
                            </div>
                            {!isAuthenticated && (
                                <div>
                                    <Auth0LoginButton />
                                </div>)}
                        </div>

                        {/* Map Section - Purple Box */}
                        <div className=" w-[250px] h-[250px] bg-[#F1F1F1] border-white">
                            {/* Animated Map */}
                            <div className="flex-grow flex items-center justify-center w-full">
                                <AnimatedMap />
                            </div>

                            <MapButton />
                        </div>

                        {/* Directory Button */}
                        <div className=" w-[250px] h-[250px] bg-[#F1F1F1] border-white">
                            {/* Animated Map */}
                            <div className="flex-grow flex items-center justify-center w-full">
                                <AnimatedService/>
                            </div>

                            <ServiceRequestbutton/>
                        </div>
                    </div>
                </div>
                <div>
                    <Footer/>
                </div>
            </div>
        </div>
    );
}
