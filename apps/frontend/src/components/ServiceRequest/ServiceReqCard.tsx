import React from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog.tsx";

type ServiceRequestCardProps = {
    title: string;
    description: string;
    image: any;
    popupComponent: React.ReactNode;
};

const ServiceRequestCard: React.FC<ServiceRequestCardProps> = ({ title, description, image, popupComponent }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="relative w-[300px] h-[400px] rounded-lg shadow-lg cursor-pointer hover:shadow-2xl">
                    {/* Full Image */}
                    <img
                        src={image}
                        alt={title}
                        className="absolute inset-0 w-full h-full object-contain"
                    />

                    {/* Overlay Text Box */}
                    <div className="absolute bottom-[50px] left-1/2 transform -translate-x-1/2 w-[250px] bg-white bg-opacity-90 p-4">
                        <h2 className="text-xl font-bold text-center font-nunito">{title}</h2>
                        <p className="text-sm text-center text-gray-600">{description}</p>
                    </div>
                </div>
            </DialogTrigger>

            {/* Popup Content */}
            <DialogContent className="place-content-center animate-in fade-in zoom-in duration-500 border-zinc-200 bg-zinc-200 h-auto">
                {popupComponent}
            </DialogContent>
        </Dialog>
    );
};

export default ServiceRequestCard;
