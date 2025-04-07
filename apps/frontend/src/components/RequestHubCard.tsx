import {Card, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Link } from "react-router-dom";

const RequestHubCard: React.FC<{link: string, title: string, iconName: IconDefinition}> = ({link,title, iconName}) => {
    return (
    <Link to={link} className="text-3xl text-center">
        <Card className="relative bg-[#d0ccd0] hover:bg-blue-700 justify-center h-50 text-black">
            <div className="absolute w-20 bg-[#addde5] top-0">
                <FontAwesomeIcon icon={iconName} />
            </div>
            <CardHeader className="place-content-center">
                <CardTitle className="text-3xl">
                    <p>{title}</p>
                </CardTitle>
            </CardHeader>
        </Card>
    </Link>
    );
}

export default RequestHubCard;