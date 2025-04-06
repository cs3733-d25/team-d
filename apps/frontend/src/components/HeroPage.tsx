import React from 'react';
import {Card} from "@/components/ui/card.tsx";
import hospitalLogo from "@/public/hospital2.png";


export default function HeroTextBox(){
    return(
        <>
            <div className="w-2/3 animate-in fade-in zoom-in duration-800">
                <Card className=" bg-cyan-200/80 text-5xl/17 box-border rounded-none border-0">
                    <div className={"basis-2/3"}>
                        <img
                            src={hospitalLogo}
                            alt="Brigham and Women’s Hospital (Founding Member, Mass General Brigham)"
                            style={{ height: "40px" }}
                            className={"mx-4 my-4"}
                        />
                    </div>
                </Card>
                <Card  className="pl-3 pr-75 pb-25 pt-25 bg-cyan-200/80 text-5xl/17 box-border rounded-none border-0 ">
                    Navigating to Your Appointment Just Got Easier.
                </Card>
            </div>
        </>
        )

}