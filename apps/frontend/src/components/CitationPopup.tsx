import React from 'react';

export interface Tech {
    name: string;
    logoSrc: string;
    projectUsage: string;
    generalPurpose: string;
    documentationLink: string;
}

interface TechPopupProps {
    tech: Tech;
    onClose: () => void;
}

export const TechPopup: React.FC<TechPopupProps> = ({ tech, onClose }) => {
    return (
        <div
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-[#F1F1F1] rounded-md shadow-lg p-6 relative"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 font-bold text-xl"
                >
                    &times;
                </button>
                <h4 className="text-lg font-semibold text-[#012D5A] mb-2">{tech.name} - General Purpose</h4>
                <p className="text-gray-700 mb-4">{tech.generalPurpose}</p>
                <h4 className="text-md font-semibold text-[#012D5A] mb-2">How we use it:</h4>
                <p className="text-gray-700 mb-4">{tech.projectUsage}</p>
                <a
                    href={tech.documentationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#012D5A] hover:bg-[#012140] text-[#F1F1F1] font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
                >
                    Learn More
                </a>
            </div>
        </div>
    );
};
