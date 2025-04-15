import React, {useState, useEffect} from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type SubmissionReqProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children?: React.ReactNode;
};


export default function SubmissionReqPopup({
    open,
    onOpenChange,
    children
}: SubmissionReqProps) {
    return(
            <AlertDialog open={open} onOpenChange={onOpenChange}>
                <AlertDialogContent>
                    <AlertDialogHeader className="flex justify-center items-center">
                        <ProgressToCheck /> {/*The Confirmation Animation*/}
                        <div className="delay-1000">
                        <AlertDialogTitle className="text-2xl font-bold mt-4 flex justify-center items-center animate-in fade-in duration-2000 ease-in-out">Service Request Submitted!</AlertDialogTitle>
                        <AlertDialogDescription className="text-base mt-2 animate-in fade-in duration-2000 ease-in-out">
                                <p>---------------------------------------------------------------</p>
                                <p></p>
                                { children }
                        </AlertDialogDescription>
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                            <AlertDialogAction onClick={() => onOpenChange(false)} className="mt-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-300 transition">
                                Close
                            </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
    );
}


{/*Process into Green Check Animation Blocks*/}

export function ProgressToCheck() {
    const [showCheck, setShowCheck] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowCheck(true)
        }, 800) // simulate a 1-second loading

        return () => clearTimeout(timer)
        }, [])

    return (
        <div className="flex justify-center items-center h-32 w-32">
            {!showCheck ? <ProcessAnimation /> : <CheckAnimation />}
        </div>
    )
}

{/*Processing before check*/}
function ProcessAnimation() {
    return (
        <div className="w-16 h-16 border-4 border-t-blue-800 border-gray-200 rounded-full animate-spin transition-all duration-500"></div>
    )
}

function CheckAnimation() {
    return (
        <div className="flex justify-center items-center animate-fade-in">

            <svg
                className="w-16 h-16 text-green-500 animate-check duration-5000"
                viewBox="0 0 60 60"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                >
                <circle cx="30" cy="30" r="28" className="stroke-current opacity-20" />
                <path d="M18 27 l8 8 l16 -16" className="path stroke-current" />
            </svg>

            <style>{`
                .animate-check .path {
                    stroke-dasharray: 48;
                    stroke-dashoffset: 48;
                    animation: dash 0.95s ease-out forwards;
                }

                @keyframes dash {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
                
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-out;
                }
                
                @keyframes fadeIn {
                    from {
                       opacity: 0;
                       transform: scale(0.95); 
                    }  
                    to {
                    opacity: 1;
                    transform: scale(1);
                }
               }
            `}</style>
        </div>
    )
}