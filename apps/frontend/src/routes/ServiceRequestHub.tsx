import {FormEvent} from 'react';
import {
    Card,
    CardContent, CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Link } from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLanguage} from "@fortawesome/free-solid-svg-icons";
import RequestHubCard from "@/components/RequestHubCard.tsx";

const ServiceRequestHub = () => {
    return (
        <div style={{marginTop: '180px'}}>
            <div className="grid grid-rows-1 grid-cols-3 gap-4">
                <RequestHubCard
                    link="/servicerequest"
                    title="Request Translator"
                    iconName={faLanguage}
                />
                <RequestHubCard
                    link="/servicerequest"
                    title={"Request 2"}
                    iconName={faLanguage}
                />
                <RequestHubCard
                    link="/servicerequest"
                    title={"Request 3"}
                    iconName={faLanguage}
                />
                <RequestHubCard
                    link="/servicerequest"
                    title={"Request 4"}
                    iconName={faLanguage}
                />
                <RequestHubCard
                    link="/servicerequest"
                    title={"Request 5"}
                    iconName={faLanguage}
                />
            </div>
        </div>
    )
}

export default ServiceRequestHub;