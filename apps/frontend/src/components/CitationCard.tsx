import React, { useState } from "react";
import { Tech, TechPopup } from "./CitationPopup";

interface TechCitationCardProps {
    tech: Tech;
}

const TechCitationCard: React.FC<TechCitationCardProps> = ({ tech }) => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const handleCardClick = () => {
        setIsPopupVisible(true);
    };

    const handleClosePopup = () => {
        setIsPopupVisible(false);
    };

    return (
        <div
            className="bg-white text-blue-900 border-2 hover:border-2 hover:bg-gray-200 rounded-md shadow-md p-4 flex flex-col items-center hover:border-0 group cursor-pointer"
            onClick={handleCardClick}
        >
            <div className="w-24 h-24 bg-white rounded-md flex items-center justify-center p-3">
                <img src={tech.logoSrc} alt={`${tech.name} Logo`} className="max-w-full max-h-full object-contain" />
            </div>

            <h3 className="text-xl font-semibold mt-2 ">
                {tech.name}
            </h3>
            <p className="text-center mt-1 ">
                {tech.projectUsage}
            </p>

            {isPopupVisible && <TechPopup tech={tech} onClose={handleClosePopup} />}
        </div>
    );
};

export default TechCitationCard;
