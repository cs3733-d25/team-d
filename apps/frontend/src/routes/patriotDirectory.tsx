import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Fuse from "fuse.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* ───── Patriot Place data ───── */
const directoryData = [
    {
        service: "Day Surgery Center",
        specialties:
            "Electromyograph (EMG), Nutrition, Pain Medicine, Physiatry, Pulmonary Function Testing, Blood Draw/Phlebotomy, Community Room, Primary",
        floorSuite: "20 & 22 Patriot Place, 4th floor",
        phone: "",
    },
    {
        service: "Surgical Specialities",
        specialties:
            "Audiology, ENT, General and Gastrointestinal Surgery, Plastic Surgery, Thoracic Surgery, Vascular Surgery, Weight Management and Wellness",
        floorSuite: "20 Patriot Place, 3rd floor",
        phone: "",
    },
    {
        service: "Sports Medicine Center",
        specialties: "X‑Ray Suite",
        floorSuite: "20 Patriot Place, 3rd floor",
        phone: "",
    },
    {
        service: "Multi‑Specialty Clinic",
        specialties:
            "Allergy, Cardiac Arrhythmia, Dermatology, Endocrinology, Gastroenterology, Kidney (Renal) Medicine, Neurology, Neurosurgery, Ophthalmology, Optometry, Pulmonology, Rheumatology, Women's Health, Patient Financial Services",
        floorSuite: "22 Patriot Place, 3rd floor",
        phone: "",
    },
    {
        service: "Orthopaedics",
        specialties:
            "Hand and Upper Extremity, Arthroplasty, Pediatric Trauma, Physiatry, Podiatry",
        floorSuite: "20 Patriot Place, 2nd floor",
        phone: "",
    },
    {
        service: "Rehabilitation Services",
        specialties:
            "Cardiac Rehab, Occupational Therapy (Hand and Upper Extremity), Physical Therapy, Speech‑Language, Clinical Lab, Surgi‑Care",
        floorSuite: "20 Patriot Place, 2nd floor",
        phone: "",
    },
    {
        service: "Urgent Care Center",
        specialties:
            "Blood Draw/Phlebotomy, Pharmacy, Radiology, Cardiovascular Services, Urology",
        floorSuite: "20 Patriot Place, 1st floor",
        phone: "",
    },
];

/* Fuse.js fuzzy search instance */
const fuse = new Fuse(directoryData, {
    keys: ["service", "specialties"],
    threshold: 0.35,
    ignoreLocation: true,
});

const PatriotPlaceDirectory: React.FC = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState(directoryData[0]);

    /* filter list */
    const filtered = useMemo(() => {
        const q = query.trim();
        return q ? fuse.search(q).map((r) => r.item) : directoryData;
    }, [query]);

    /* keep details pane in sync with first match */
    useEffect(() => {
        if (filtered.length && !filtered.includes(selected)) setSelected(filtered[0]);
    }, [filtered, selected]);

    return (
        <div className="min-h-screen bg-white flex flex-col items-center py-8">
            <div className="w-full max-w-6xl h-[80vh] rounded-xl shadow-md border border-gray-200 overflow-hidden flex">
                {/* ---------- Left column ---------- */}
                <div className="w-4/12 h-full border-r border-gray-200 flex flex-col p-5 bg-white">
                    {/* hospital switch buttons */}
                    <div className="flex gap-3 mb-4">
                        <Button
                            className="flex-1 px-4 py-2 text-base bg-gray-200"
                            onClick={() => navigate("/directory")}
                        >
                            Chestnut&nbsp;Hill
                        </Button>
                        <Button className="flex-1 px-4 py-2 text-base bg-blue-600 text-white">
                            Patriot&nbsp;Place
                        </Button>
                    </div>

                    {/* search bar */}
                    <Input
                        placeholder="Search services or specialties…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="mb-4"
                    />

                    {/* scrollable list */}
                    <div className="flex-1 overflow-y-auto pr-1">
                        <ul className="space-y-1">
                            {filtered.map((item) => (
                                <li key={item.service}>
                                    <Button
                                        variant="ghost"
                                        className={`w-full justify-start rounded-md px-3 py-2 text-left ${
                                            selected.service === item.service
                                                ? "bg-blue-50 font-semibold text-blue-900"
                                                : "hover:bg-gray-100"
                                        }`}
                                        onClick={() => setSelected(item)}
                                    >
                                        {item.service}
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* ---------- Right column ---------- */}
                <div className="w-8/12 p-10 overflow-y-auto">
                    <h1 className="text-3xl font-bold text-blue-900 mb-6">
                        {selected.service}
                    </h1>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-3">Services</h2>
                        <ul className="list-disc list-inside space-y-1">
                            {selected.specialties.split(/[,•]/).map((s) => (
                                <li key={s.trim()}>{s.trim()}</li>
                            ))}
                        </ul>
                    </section>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-xl font-semibold mb-1">Floor &amp; Suite</h2>
                            <p>{selected.floorSuite}</p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-1">Contact</h2>
                            {selected.phone ? (
                                <a
                                    href={`tel:${selected.phone.replace(/\D/g, "")}`}
                                    className="text-blue-700 hover:underline"
                                >
                                    {selected.phone}
                                </a>
                            ) : (
                                <p className="text-gray-600">N/A</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatriotPlaceDirectory;