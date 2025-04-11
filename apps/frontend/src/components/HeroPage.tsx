import React from 'react';
import {Card} from "@/components/ui/card.tsx";
import Auth0LoginButton from "@/components/Auth0LoginButton.tsx";


export default function HeroTextBox(){
    return(
        <>
            <div className="w-2/3 animate-in fade-in zoom-in duration-800 pl-3 pr-75 pb-25 pt-25 bg-transparent-200/80 text-5xl/17 text-white ">
                <b>Navigating to Your Appointment Just Got Easier.</b>
                <Auth0LoginButton />
            </div>
        </>
        )
}