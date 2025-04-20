import React from 'react';
import AnimatedGraphic from "@/components/ui/animatedGraphic.tsx";
import AnimatedMap from "@/components/ui/animatedMap.tsx";
import HeroTextBox from "@/components/HeroPage.tsx";
import Auth0LoginButton from "@/components/Auth0LoginButton.tsx";
import MapButton from "@/components/MapButton.tsx";
import DirectoryButton from "@/components/DirectoryButton.tsx";
import Footer from "@/components/Footer.tsx";
import { useAuth0 } from "@auth0/auth0-react";

// Use for comments
{/**/}


export default function Home() {
    const { user, isAuthenticated } = useAuth0();

    return (
        <div className="grid grid-rows-[auto_1fr_auto] w-full min-h-screen overflow-hidden">

            {/* Hero Section */}
            <div className="relative grid grid-rows-[auto_auto_auto] gap-3 w-full h-screen items-center justify-center">

                {/* Background Animation Layer */}
                <div className="absolute inset-0 -z-10 flex items-center justify-center">
                    <AnimatedGraphic />
                </div>

                {/* Background Image - Full Coverage */}
                <div className="absolute inset-0 bg-[url(../public/Hospital.jpg)] bg-cover bg-center bg-no-repeat"></div>

                {/* Background Overlays for Styling */}
                <div className="absolute inset-0 bg-yellow-600/10 mix-blend-multiply pointer-events-none"></div>
                <div className="absolute inset-0 bg-zinc-900/50 pointer-events-none"></div>

                {/* Hero Text - Ensuring Visibility */}
                <div className="relative z-10 text-white text-center">
                    <HeroTextBox />
                </div>

                {/* Animated Map Below Hero */}
                <div className="relative z-10 place-self-center">
                    <AnimatedMap />
                </div>

                {/* Buttons Section */}
                <div className="relative z-10 grid grid-cols-3 gap-6 justify-center mt-6">
                    {!isAuthenticated && <Auth0LoginButton />}
                    <MapButton />
                    <DirectoryButton />
                </div>
            </div>

            {/* Footer Section - Separate Row */}
            <div className="w-full bg-white py-12">
                <Footer />
            </div>
        </div>
    );
}
