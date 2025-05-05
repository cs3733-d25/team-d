import React from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog.tsx";
import AnimatedEquipment from "@/components/ServiceRequest/EquipmentRequest/animatedEquipment.tsx";
import EquipmentForm from "@/components/ServiceRequest/EquipmentRequest/EquipmentServiceRequest.tsx";

const EquipmentButton: React.FC = () => {
    return (
        <Dialog>
            {/* Button to trigger popup */}
            <DialogTrigger asChild>
                <button className="flex flex-col items-center border-4 w-65 rounded-lg border-white text-center bg-black/30 hover:bg-black/60 text-white animate-in fade-in zoom-in duration-500 font-nunito hover:scale-110 cursor-pointer">
                    <div className="bg-white border-white w-full">
                        <AnimatedEquipment />
                    </div>
                    <div className="p-4 w-full">
                        MEDICAL EQUIPMENT
                    </div>
                </button>
            </DialogTrigger>

            {/* Popup Form */}
            <DialogContent className="place-content-center animate-in fade-in zoom-in duration-500 h-auto bg-white">
                <EquipmentForm />
            </DialogContent>
        </Dialog>
    );
};

export default EquipmentButton;
