import React from 'react';
import ServiceRequestCard from "@/components/ServiceRequest/ServiceReqCard.tsx";
import {faLanguage} from "@fortawesome/free-solid-svg-icons";
import {faHandHoldingDroplet} from "@fortawesome/free-solid-svg-icons";
import {faScrewdriverWrench} from "@fortawesome/free-solid-svg-icons";
import {faShield} from "@fortawesome/free-solid-svg-icons";
import translatorImage from "../public/translatorReq.jpg"
import sanitationImage from "../public/translatorReq.jpg"
import equipmentImage from "../public/translatorReq.jpg"
import securityImage from "../public/translatorReq.jpg"
// import TranslatorRequestPopup from "@/components/ServiceRequest/TranslatorRequest/TranslatorRequestPopup.tsx";
// import SanitationPopup  from "@/components/ServiceRequest/SanitationRequest/SanitationPopup.tsx";
// import EquipmentRequestPopup from "@/components/ServiceRequest/EquipmentRequest/EquipmentRequestPopup.tsx";
// import SecurityRequestPopup from "@/components/ServiceRequest/SecurityRequest/SecurityRequestPopup.tsx";
import TranslatorServiceRequest from "@/components/ServiceRequest/TranslatorRequest/TranslatorServiceRequest.tsx";

import SanitationServiceRequest from "@/components/ServiceRequest/SanitationRequest/SanitationServiceRequest.tsx";
import EquipmentServiceRequest from "@/components/ServiceRequest/EquipmentRequest/EquipmentServiceRequest.tsx";
import SecurityServiceRequest from "@/components/ServiceRequest/SecurityRequest/SecurityServiceRequest.tsx";
import ServiceHubBackground from "../public/ServiceHubBackground.png";



const ServiceRequestHub = () => {
    return (
        <div className="min-h-screen flex flex-col bg-[url(../public/service_request_bg.jpg)] bg-cover bg-center bg-no-repeat">
            {/* Overlay for blending */}

            {/* Main Content */}
            <main className="relative flex flex-col items-center justify-center z-10 flex-grow">
                <div className="absolute inset-0 bg-yellow-600/10 mix-blend-multiply pointer-events-none"></div>
                <div className="absolute inset-0 bg-zinc-900/50 pointer-events-none"></div>
                <div className="relative text-5xl z-10 mb-10 pb-4 flex top-x items-center justify-center justify-top mt-5 h-20 w-110 text-5xl font-bold font-nunito">
                    Service Requests
                </div>
                <div className="relative flex items-center justify-center h-auto w-full overflow-hidden p-8">
                    <div className="flex justify-between items-center w-full px-8">
                        <ServiceRequestCard
                            title="Translator"
                            image={translatorImage}
                            popupComponent={<TranslatorServiceRequest />}
                        />
                        <ServiceRequestCard
                            title="Sanitation"
                            image={sanitationImage}
                            popupComponent={<SanitationServiceRequest />}
                        />
                        <ServiceRequestCard
                            title="Equipment"
                            image={equipmentImage}
                            popupComponent={<EquipmentServiceRequest />}
                        />
                        <ServiceRequestCard
                            title="Security"
                            image={securityImage}
                            popupComponent={<SecurityServiceRequest />}
                        />
                    </div>

                </div>
            </main>
        </div>
    );
}

export default ServiceRequestHub;