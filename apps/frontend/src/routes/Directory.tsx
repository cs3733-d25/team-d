import React, { useState } from "react";
import "../styles/directorystyles.css";
import hospitalLogo from "../public/hospital2.png";

// Directory data for each service
const directoryData = [
    {
        service: "Allergy and Clinical Immunology",
        specialties:
            "Allergy, environmental, food, medication, allergies, venom assessment, asthma, anaphylaxis, angioedema, sinusitis, antihistamine desensitization",
        floorSuite: "3rd floor, suite 540",
        phone: "(617) 732–9850",
    },
    {
        service: "Child Care Center (Mon–Fri, 8 a.m.–4:30 p.m.)",
        specialties: "Backup childcare for employees",
        floorSuite: "3rd floor, suite 317",
        phone: "(617) 732–9800",
    },
    {
        service: "Brigham Dermatology Associates (BDA)",
        specialties: "Medical and surgical dermatology",
        floorSuite: "3rd floor, suite 317",
        phone: "(617) 732–4918",
    },
    {
        service: "Brigham Physicians Group (BPG)",
        specialties: "Internal medicine/primary care",
        floorSuite: "3rd floor, suite 317",
        phone: "(617) 732–9927",
    },
    {
        service: "Brigham Physicians Group – Center for Pain Medicine",
        specialties:
            "Physician/spine, PT/OT, Massage, Acupuncture, Chiropractor, Integrative therapies",
        floorSuite: "2nd floor, suite 215",
        phone: "(617) 732–9050",
    },
    {
        service: "Crohn's and Colitis Center",
        specialties: "Multidisciplinary, Inflammatory Bowel Disease (IBD) care",
        floorSuite: "3rd floor, suite 312",
        phone: "(617) 732–6389",
    },
    {
        service: "Endoscopy Center",
        specialties: "Colonoscopy, Endoscopy",
        floorSuite: "3rd floor, suite 320",
        phone: "(617) 732–7426",
    },
    {
        service: "Laboratory (Mon–Fri, 7 a.m.–7 p.m.; Sat, 7 a.m.–3 p.m.)",
        specialties: "Blood draw, processing, etc.",
        floorSuite: "3rd floor, suite 312",
        phone: "(617) 732–9900",
    },
    {
        service: "Multispecialty Clinic",
        specialties:
            "Rheumatology, Infectious Disease, Travel Medicine, Endocrinology, Nutrition",
        floorSuite: "3rd floor, suite 320",
        phone: "(617) 732–9905",
    },
    {
        service: "Osher Clinical Center for Integrative Health",
        specialties: "Chiropractic, Acupuncture, Integrative Medicine, etc.",
        floorSuite: "2nd floor, suite 215",
        phone: "(617) 732–9700",
    },
    {
        service: "Patient Financial Services",
        specialties: "Payment, insurance, billing questions",
        floorSuite: "2nd floor, suite 204B",
        phone: "(617) 732–9930",
    },
    {
        service: "Pharmacy",
        specialties: "Prescription services, refills",
        floorSuite: "2nd floor, suite 205",
        phone: "(617) 732–9955",
    },
    {
        service: "Radiology, MRI/CT scan",
        specialties: "CT scan, MRI, X-Ray",
        floorSuite: "1st floor, suite 102",
        phone: "(617) 732–9821",
    },
    {
        service: "Rehabilitation Services",
        specialties: "Occupational Therapy, Physical Therapy, etc.",
        floorSuite: "1st floor, suite 105",
        phone: "(617) 732–9820",
    },
];

const Directory: React.FC = () => {
    const [selectedService, setSelectedService] = useState("");
    const [showDirections, setShowDirections] = useState(false);

    const matchedItem = directoryData.find(
        (item) => item.service === selectedService
    );

    const handleGetDirections = () => {
        if (!selectedService) {
            alert("Please select a service first.");
            return;
        }
        setShowDirections(true);
    };

    return (
        <>

            <main>
                <h1>Find Your Care</h1>

                <label htmlFor="service">Select a Service</label>
                <select
                    id="service"
                    value={selectedService}
                    onChange={(e) => {
                        setSelectedService(e.target.value);
                        setShowDirections(false); // reset details if selection changes
                    }}
                >
                    <option value="">-- Choose a Service --</option>
                    {directoryData.map((item) => (
                        <option key={item.service} value={item.service}>
                            {item.service}
                        </option>
                    ))}
                </select>

                <button onClick={handleGetDirections}>Get Directions</button>

                {/* Display the detailed info if available */}
                {showDirections && matchedItem && (
                    <section className="directions-info">
                        <h2>{matchedItem.service}</h2>
                        <p>
                            <strong>Specialties and Services:</strong>{" "}
                            {matchedItem.specialties}
                        </p>
                        <p>
                            <strong>Floor and Suite:</strong> {matchedItem.floorSuite}
                        </p>
                        <p>
                            <strong>Telephone:</strong> {matchedItem.phone}
                        </p>
                    </section>
                )}
            </main>
        </>
    );
};

export default Directory;
