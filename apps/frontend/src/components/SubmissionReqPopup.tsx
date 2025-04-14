import React, {useState, useEffect} from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function SubmissionReqPopup() {
    return(
        <div className="w-50 h-50 text-center bg-blue-500">
            <AlertDialog>
                <AlertDialogTrigger>Submit</AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <ProgressToCheck /> {/*The Confirmation Animation*/}
                        <div className="delay-1000">
                        <AlertDialogTitle className="text-2xl font-bold mt-4 animate-in fade-in duration-2000 ease-in-out">Service Request Confirmed!</AlertDialogTitle>
                        <AlertDialogDescription className="text-base mt-2 animate-in fade-in duration-2000 ease-in-out">
                            Check your service request listing
                        </AlertDialogDescription>
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                            <AlertDialogAction className="mt-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-300 transition">
                                Close
                            </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}


{/*Process into Green Check Animation Blocks*/}

export function ProgressToCheck() {
    const [showCheck, setShowCheck] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowCheck(true)
        }, 1000) // simulate a 2-second loading

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
                viewBox="0 0 52 52"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                >
                <circle cx="26" cy="25" r="25" className="stroke-current opacity-20" />
                <path d="M14 27 l7 7 l17 -17" className="path stroke-current" />
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