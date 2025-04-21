import React from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog.tsx";

type ServiceRequestCardProps = {
    title: string;
    image: any;
    popupComponent: React.ReactNode;
};

const ServiceRequestCard: React.FC<ServiceRequestCardProps> = ({ title, image, popupComponent }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="relative w-[300px] h-[400px] rounded-lg shadow-lg cursor-pointer hover:shadow-2xl">
                    {/* Full Image */}
                    <img
                        src={image}
                        alt={title}
                        className="absolute inset-0 w-full h-[350px] rounded-md  object-cover "
                    />

                    {/* Overlay Text Box */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[250px] bg-white rounded-md bg-opacity-90 p-4">
                        <h2 className="text-3xl font-bold text-center font-nunito mb-2">{title}</h2>
                        <button
                            className=" w-full px-4 py-2 bg-[#012D5A] text-white text-lg rounded-md  hover:bg-blue-600 active:scale-95 focus:outline-none"
                        >
                            Submit a Form
                        </button>
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
