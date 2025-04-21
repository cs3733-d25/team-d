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
            {/* Make the entire card clickable */}
            <DialogTrigger asChild>
                <div className="flex flex-col items-center justify-between w-[300px] h-[400px] bg-white shadow-lg rounded-xl p-6 cursor-pointer hover:shadow-2xl">
                    {/* Image */}
                    <div className="w-full h-[150px]">
                        <img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover rounded-t-md"
                        />
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-center font-nunito mt-4">{title}</h2>

                    {/* Description */}
                    <p className="text-sm text-gray-600 text-center mt-2">{description}</p>
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
