import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from '@/components/ui/dialog';
import {Card, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import EquipmentServiceRequest from "@/components/EquipmentServiceRequest.tsx";

const EquipmentRequestPopup: React.FC<{title: string, iconName: IconDefinition}> = ({title, iconName}) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Card className="relative bg-[#d0ccd0] hover:bg-[#addde5] justify-center h-50 text-black">
                    <div className="absolute flex items-center justify-center rounded-tl-md w-20 h-10 bg-[#addde5] top-0">
                        <FontAwesomeIcon icon={iconName} size="2x" />
                    </div>
                    <CardHeader className="place-content-center">
                        <CardTitle className="text-3xl">
                            <p>{title}</p>
                        </CardTitle>
                    </CardHeader>
                </Card>
            </DialogTrigger>

            <DialogContent className="place-content-center animate-in fade-in zoom-in duration-500 border-none">
                <EquipmentServiceRequest />
            </DialogContent>
        </Dialog>
    );
}

export default EquipmentRequestPopup;