import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog.tsx';
import { Card, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import TranslatorServiceRequest from "@/components/ServiceRequest/TranslatorRequest/TranslatorServiceRequest.tsx";

const TranslatorRequestPopup: React.FC<{ title: string }> = ({ title }) => (
    <Dialog>
        <DialogTrigger asChild>
            <div className="relative bg-[#d0ccd0] hover:bg-[#addde5] justify-center h-70 w-60 text-black rounded-lg p-4 cursor-pointer">
                <h2 className="text-3xl text-center">{title}</h2>
            </div>
        </DialogTrigger>
        <DialogContent className="place-content-center animate-in fade-in zoom-in duration-500 border-zinc-200 bg-zinc-200 h-150">
            <TranslatorServiceRequest />
        </DialogContent>
    </Dialog>
);


export default TranslatorRequestPopup;
