import {faLanguage} from "@fortawesome/free-solid-svg-icons";
import ServiceRequestPopup from "@/components/ServiceRequestPopup.tsx";
import EquipmentRequestPopup from "@/components/EquipmentRequestPopup.tsx";

const ServiceRequestHub = () => {
    return (
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
                <EquipmentRequestPopup
                    title="Request Equipment"
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
    )
}

export default ServiceRequestHub;