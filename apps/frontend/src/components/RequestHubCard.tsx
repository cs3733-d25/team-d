import {Card, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLanguage} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const RequestHubCard: React.FC<{link: string, title: string}> = ({link,title}) => {
    return (
    <Link to={link} className="text-3xl text-center">
        <Card className="bg-blue-700/70 hover:bg-blue-700 justify-center h-50 text-white">
            <CardHeader className="place-content-center">
                <CardTitle className="text-3xl">
                    <FontAwesomeIcon icon={faLanguage} size="2x" />
                    <p>{title}</p>
                </CardTitle>
            </CardHeader>
        </Card>
    </Link>
    );
}

export default RequestHubCard;