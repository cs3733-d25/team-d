import React, { useState } from 'react';
import { Tech, TechPopup } from './CitationPopup';

interface TechCitationCardProps {
    tech: Tech;
}

const TechCitationCard: React.FC<TechCitationCardProps> = ({ tech }) => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const handleLogoClick = () => {
        setIsPopupVisible(true);
    };

    const handleClosePopup = () => {
        setIsPopupVisible(false);
    };

    return (
        <div className="bg-[#F1F1F1] rounded-md shadow-md p-4 flex flex-col items-center">
            <div
                className="w-20 h-20 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300"
                onClick={handleLogoClick}
            >
                <img src={tech.logoSrc} alt={`${tech.name} Logo`} className="max-w-full max-h-full object-contain" />
            </div>
            <h3 className="text-xl font-semibold text-[#012D5A] mt-2">{tech.name}</h3>
            <p className="text-gray-700 text-center mt-1">{tech.projectUsage}</p>

            {isPopupVisible && (
                <TechPopup tech={tech} onClose={handleClosePopup} />
            )}
        </div>
    );
};

export default TechCitationCard;