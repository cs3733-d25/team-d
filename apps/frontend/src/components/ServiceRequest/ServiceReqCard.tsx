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
            <div className=" relative w-[300px] h-[400px] rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-shadow duration-300">
                {/* Full Image */}
                <img
                    src={image}
                    alt={title}
                    className="border-3 border-blue-900 absolute inset-0 w-full h-[350px] rounded-md object-cover"
                />

                {/* Overlay Text Box */}
                    <DialogTrigger asChild>
                        <div className="border-2 border-amber-600 absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[250px] bg-white rounded-md bg-opacity-90 p-4 hover:bg-[#012D5A] hover:text-amber-600 transition-colors duration-200 active:scale-95">
                            <h2 className="text-3xl  font-semibold text-center font-nunito mb-2 cursor-pointer">
                                {title}
                            </h2>
                        </div>
                    </DialogTrigger>
            </div>


            {/* Popup Content */}
            <DialogContent className="place-content-center animate-in fade-in zoom-in duration-500 h-auto bg-white">
                {popupComponent}
            </DialogContent>
        </Dialog>
    );
};

export default ServiceRequestCard;
