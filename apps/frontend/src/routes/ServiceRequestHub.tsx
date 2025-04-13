import {faLanguage} from "@fortawesome/free-solid-svg-icons";
import ServiceRequestPopup from "@/components/ServiceRequestPopup.tsx";
import ServiceHubBackground from "../public/ServiceHubBackground.png";

const ServiceRequestHub = () => {
    return (
        <>


            <img src={ServiceHubBackground} className="absolute h-screen w-screen z-0" />

            {/*Overlay*/}
            <div className="absolute inset-0 bg-yellow-600/10 mix-blend-multiply pointer-events-none"/>
            <div className="absolute inset-0 bg-zinc-900/50 pointer-events-none"/>

            <div className="relative flex justify-center">
                <div className="absolute flex items-center justify-center mt-24 bg-gray-300/60 h-20 w-110 rounded-full text-5xl font-bold font-nunito font-nunito">Service Requests</div>
            </div>
            <div className="relative flex justify-center h-screen w-screen">
                <div className="absolute mt-80 flex flex-row items-center justify-evenly bg-blue-900/80 w-300 h-100 z-10">
                    <ServiceRequestPopup
                        title="Request Translator"
                        iconName={faLanguage} />
                    <ServiceRequestPopup
                        title="Request Translator"
                        iconName={faLanguage} />
                    <ServiceRequestPopup
                        title="Request Translator"
                        iconName={faLanguage} />
                    <ServiceRequestPopup
                        title="Request Translator"
                        iconName={faLanguage} />
                </div>
            </div>
            </>
    )
}

export default ServiceRequestHub;