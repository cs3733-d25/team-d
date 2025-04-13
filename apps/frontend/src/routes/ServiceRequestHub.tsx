import {faLanguage} from "@fortawesome/free-solid-svg-icons";
import ServiceRequestPopup from "@/components/ServiceRequestPopup.tsx";
import ServiceHubBackground from "../public/ServiceHubBackground.png";

const ServiceRequestHub = () => {
    return (
        <>
        {/*Image Background*/}
        <div>
            <img src={ServiceHubBackground} className="absolute h-screen"/>
        </div>
            {/*Service Request Buttons*/}
            <div style={{marginTop: '180px'}}>
            <div className="grid grid-rows-1 grid-cols-3 gap-4 ml-4">
                <ServiceRequestPopup
                    title="Request Translator"
                    iconName={faLanguage}
                />
                <ServiceRequestPopup
                    title="Request 2"
                    iconName={faLanguage}
                />
                <ServiceRequestPopup
                    title="Request 3"
                    iconName={faLanguage}
                />
                <ServiceRequestPopup
                    title="Request 4"
                    iconName={faLanguage}
                />
                <ServiceRequestPopup
                    title="Request 5"
                    iconName={faLanguage}
                />
            </div>
        </div>
        </>
    )
}

export default ServiceRequestHub;