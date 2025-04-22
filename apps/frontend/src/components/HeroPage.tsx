import React from 'react';
import {Card} from "@/components/ui/card.tsx";
import Auth0LoginButton from "@/components/Auth0LoginButton.tsx";


export default function HeroTextBox(){
    return(
        <>
            <div className="text-8xl animate-in fade-in zoom-in duration-800 text-white ">
                <b className="font-thin text-4xl">Navigating to Your Appointment Just Got Easier.</b>
            </div>
        </>
        )
}