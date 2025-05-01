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
            className="bg-[#F1F1F1] border-2 border-amber-600 rounded-md shadow-md p-4 flex flex-col items-center hover:border-0 hover:bg-[#012D5A] hover:text-amber-600 group cursor-pointer"
            onClick={handleCardClick} // Popup triggers when clicking the card
        >
            {/* White rounded square around the logo */}
            <div className="w-24 h-24 bg-white rounded-md flex items-center justify-center p-3">
                <img src={tech.logoSrc} alt={`${tech.name} Logo`} className="max-w-full max-h-full object-contain" />
            </div>

            {/* Tech Name & Usage */}
            <h3 className="text-xl font-semibold text-[#012D5A] mt-2 group-hover:text-amber-600">
                {tech.name}
            </h3>
            <p className="text-gray-700 text-center mt-1 group-hover:text-amber-600">
                {tech.projectUsage}
            </p>

            {/* Popup appears when clicking the card */}
            {isPopupVisible && <TechPopup tech={tech} onClose={handleClosePopup} />}
        </div>
    );
};

export default TechCitationCard;
