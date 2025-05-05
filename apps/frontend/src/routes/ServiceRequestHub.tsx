import React from 'react';
import ServiceRequestCard from "@/components/ServiceRequest/ServiceReqCard.tsx";
import {faLanguage} from "@fortawesome/free-solid-svg-icons";
import {faHandHoldingDroplet} from "@fortawesome/free-solid-svg-icons";
import {faScrewdriverWrench} from "@fortawesome/free-solid-svg-icons";
import {faShield} from "@fortawesome/free-solid-svg-icons";
import translatorImage from "../public/translation.jpg"
import sanitationImage from "../public/sanitation_pic.webp"
import equipmentImage from "../public/equipment.jpg"
import securityImage from "../public/security2.jpg"
import serviceRequestBg from "../public/service_request_bg.jpg";
// import TranslatorRequestPopup from "@/components/ServiceRequest/TranslatorRequest/TranslatorRequestPopup.tsx";
// import SanitationPopup  from "@/components/ServiceRequest/SanitationRequest/SanitationPopup.tsx";
// import EquipmentRequestPopup from "@/components/ServiceRequest/EquipmentRequest/EquipmentRequestPopup.tsx";
// import SecurityRequestPopup from "@/components/ServiceRequest/SecurityRequest/SecurityRequestPopup.tsx";
import TranslatorServiceRequest from "@/components/ServiceRequest/TranslatorRequest/TranslatorButton.tsx";

import SanitationServiceRequest from "@/components/ServiceRequest/SanitationRequest/SanitationButton.tsx";
import EquipmentServiceRequest from "@/components/ServiceRequest/EquipmentRequest/EquipmentButton.tsx";
import SecurityServiceRequest from "@/components/ServiceRequest/SecurityRequest/SecurityButton.tsx";
import ServiceHubBackground from "../public/ServiceHubBackground.png";


const ServiceRequestHub = () => {
    return (
        <div
            className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('https://media.istockphoto.com/photos/medical-background-picture-id905376298?k=20&m=905376298&s=612x612&w=0&h=iaGMwPjIYzFgxCMDf_w995i-C6myWa0Hbs3nep7rlzg=')` }}

        >


            <main className="relative flex flex-col items-center justify-center z-10 flex-grow">
                <div className="absolute inset-0 bg-yellow-600/10 mix-blend-multiply pointer-events-none"></div>
                <div className="absolute inset-0 bg-zinc-900/50 pointer-events-none"></div>
                <div className="relative text-5xl z-10 mb-10 pb-4 flex items-center justify-center justify-top mt-5 h-20 w-full">
                    <div className="text-5xl bg-blue-900 w-screen py-4 font-bold text-white text-center">
                        Service Requests
                    </div>
                </div>
                <div className="relative flex items-center justify-center h-auto w-full overflow-hidden p-8">
                    <div className="flex justify-between items-center w-full px-8">
                        <TranslatorServiceRequest />
                        <SanitationServiceRequest />

                        <EquipmentServiceRequest />

                        <SecurityServiceRequest />
                    </div>
                </div>
            </main>
        </div>
    );
}

//
export default ServiceRequestHub;