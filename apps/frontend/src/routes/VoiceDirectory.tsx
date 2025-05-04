import React, { useEffect, useMemo, useRef, useState } from "react";
import Fuse from "fuse.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, MicOff } from "lucide-react";
import beep from "../components/beep.mp3";
import axios from "axios";
import {API_ROUTES} from "common/src/constants.ts";

/* Browser type helpers */
declare global {
    interface Window {
        webkitSpeechRecognition: any;
        SpeechRecognition: any;
    }
}

type Entry = {
    name: string;
    services: string;
    room: string;
    telephone: string;
};

// const chestnutData: Entry[] = [
//     {
//         name: "Allergy and Clinical Immunology",
//         services:
//             "Allergy, Environmental, Food, Medication, Venoms, Asthma, Anaphylaxis, Angioedema, Sinusitis, Immunodeficiency",
//         room: "3rd floor, suite 301 & 5th floor, suite 540",
//         telephone: "(617) 732–9850",
//     },
//     {
//         name: "Child Care Center (Mon–Fri, 8 a.m.–4:30 p.m.)",
//         services: "Backup childcare for employees",
//         room: "2nd floor, suite 210",
//         telephone: "(617) 732–9543",
//     },
//     {
//         name: "Brigham Dermatology Associates (BDA)",
//         services: "Medical and surgical dermatology",
//         room: "3rd floor, suite 317",
//         telephone: "(617) 732–9080",
//     },
//     {
//         name: "Brigham Obstetrics and Gynecology Group (BOGG)",
//         services: "Gynecology, Obstetrics",
//         room: "5th floor, suite 575",
//         telephone: "(617) 732–9100",
//     },
//     {
//         name: "Brigham Physicians Group (BPG)",
//         services: "Adult Primary Care",
//         room: "4th floor, suite 428 & 5th floor, suite 530",
//         telephone: "(617) 732–9900",
//     },
//     {
//         name: "Brigham Psychiatric Specialities",
//         services: "Psychiatry, Psychology, Social Work",
//         room: "3rd floor, suite 303",
//         telephone: "(617) 732–9811",
//     },
//     {
//         name: "Center for Pain Medicine",
//         services: "Multidisciplinary pain management",
//         room: "3rd floor, suite 320",
//         telephone: "(617) 732–9060",
//     },
//     {
//         name: "Crohn's and Colitis Center",
//         services:
//             "Crohn's disease, Inflammatory bowel disease, Infusion services, Microscopic colitis, Pulmonary, Rheumatology, Ulcerative colitis",
//         room: "2nd floor, suite 201",
//         telephone: "(617) 732–6389",
//     },
//     {
//         name: "Endoscopy Center",
//         services:
//             "Bacterial overgrowth breath test, colonoscopy, H. pylori breath test, lactose malabsorption breath test, upper endoscopy",
//         room: "2nd floor, suite 202",
//         telephone: "(617) 732–7426",
//     },
//     {
//         name: "Gretchen S. and Edward A. Fish Center for Women's Health",
//         services:
//             "Cardiology, Dermatology (cosmetic, medical, and surgical), Endocrinology, Gastroenterology, Gynecology, Hematology, Infectious Diseases, Mental Health (social work), General neurology, Nutrition, Primary care, Pulmonary, Renal, Rheumatology, Sleep medicine, Women's Health (Menopause and Midlife Clinic, Obstetric Internal Medicine)",
//         room: "4th floor, suite 402",
//         telephone: "(617) 732–9300",
//     },
//     {
//         name: "Laboratory (Mon–Fri, 7 a.m.–7 p.m.; Sat, 7 a.m.–3 p.m.)",
//         services: "Blood work, lab services",
//         room: "1st floor, suite 100",
//         telephone: "(617) 732–9841",
//     },
//     {
//         name: "Multi-Specialty Clinic",
//         services:
//             "Orthopedic surgery, Vascular surgery, Contact Dermatitis and Occupational Dermatology Program, Pain Medicine and Travel Medicine",
//         room: "1st floor, suite 130",
//         telephone: "(617) 732–9500",
//     },
//     {
//         name: "Osher Clinical Center for Integrative Health",
//         services:
//             "Acupuncture, health coaching, chiropractic, craniosacral therapy, integrative medicine, structural massage & movement therapies, neurology (movement disorders and headache), echocardiography, and pulmonary. Educational courses: Integrative wellness courses are also offered.",
//         room: "4th floor, suite 422",
//         telephone: "(617) 732–9700",
//     },
//     {
//         name: "Patient Financial Services",
//         services: "Patient financial counselling (Payment, Insurance, Billing questions)",
//         room: "2nd floor, suite 204-B",
//         telephone: "(617) 732–9677",
//     },
//     {
//         name: "Pharmacy (Monday - Friday, 9 am-4 pm excluding holidays)",
//         services: "Outpatient Pharmacy Service",
//         room: "3rd floor, suite 317",
//         telephone: "(617) 732–9040",
//     },
//     {
//         name: "Radiology",
//         services: "Bone Density, Breast Imaging/Mammography, Ultrasound, X-Ray",
//         room: "5th floor, suite 560",
//         telephone: "(617) 732–9801",
//     },
//     {
//         name: "Radiology, MRI/CT scan",
//         services: "CT scan, MRI, X-Ray",
//         room: "1st floor, suite 102-B",
//         telephone: "(617) 732–9821",
//     },
//     {
//         name: "Rehabilitation Services",
//         services:
//             "Orthopedic, sports, neurologic and vestibular Physical Therapy, Men's and Women's pelvic floor Physical Therapy. Hand/Occupational, Therapy Speech Language Pathology",
//         room: "2nd floor, suite 200",
//         telephone: "(617) 732–9525",
//     },
// ];
const chestnutData: Entry[] = (await axios.get(API_ROUTES.DEPARTMENT+"/hospital/0")).data;

const patriotData: Entry[] = [
    {
        name: "Day Surgery Center",
        services:
            "Electromyograph(EMG), Nutrion, Pain Medicine, Physiatry, Pulmonary Function Testing, Blood Draw/Phlebotomy, Community Room, Primary",
        room: "20 & 22 Patriot Place, 4th floor",
        telephone: "",
    },
    {
        name: "Surgical Specialities",
        services: "Audiology, ENT, Genereal and Gastrointestinal Surgery, Plastic Surgery, Thoracic Surgery, Vascular Surgery, Weight Management and Wellness",
        room: "20 Patriot Place, 3rd floor",
        telephone: "",
    },
    {
        name: "Sports Medicine Center",
        services: "X-Ray Suite",
        room: "20 Patriot Place, 3rd floor",
        telephone: "",
    },
    {
        name: "Multi Specialty Clinic",
        services: "Allergy, Cardiac Arrhythmia, Dermatology, Endocrinology, Gastroenterology, Kidney (Renal) Medicine, Neurology, Neurosurgery, Ophthalmology, Optometry, Pulmonology, Rheumatology, Women's Health, Patient Financial Seervices",
        room: "22 Patriot Place, 3rd floor",
        telephone: "",
    },
    {
        name: "Orthopaedics",
        services: "Hand and Upper Extremity, Arthroplasty, Pediatric Trauma, Physiatry, Podiatry",
        room: "20 Patriot Place, 2nd floor",
        telephone: "",
    },
    {
        name: "Rehabilitation Services",
        services: "Cardiac Rehab, Occupational Therapy (Hand and Upper Extremity), Physical Therapy, Speech - Language, Clinical Lab, Surgi-Care",
        room: "20 Patriot Place, 2nd floor",
        telephone: "",
    },
    {
        name: "Urgent Care Center",
        services:
            "Blood Draw/Phlebotomy, Pharmacy, Radiology, Cardiovascular Services, Urology",
        room: "20 Patriot Place, 1st floor",
        telephone: "",
    },
];

/* Faulkner Hospital */
const faulknerData: Entry[] = [];

/* Brigham Main Campus */
const mainCampusData: Entry[] = [];


/* Fuse helper  */
const createFuse = (data: Entry[]) =>
    new Fuse(data, {
        keys: ["service", "specialties"],
        threshold: 0.35,
        ignoreLocation: true,
    });

const VoiceDirectory: React.FC = () => {
    /* directory state */
    const [hospital, setHospital] = useState<0 | 1 | 2 | 3>(0);   // 0‑CH 1‑PP 2‑F 3‑MC
    const data = useMemo(() => {
        switch (hospital) {
            case 0: return chestnutData;
            case 1: return patriotData;
            case 2: return faulknerData;
            case 3: return mainCampusData;
            default: return [];
        }
    }, [hospital]);

    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState<Entry>(data[0]);

    const fuse = useMemo(() => createFuse(data), [data]);
    const filtered = useMemo(
        () => (query.trim() ? fuse.search(query).map((r) => r.item) : data),
        [query, fuse]
    );

    useEffect(() => {
        if (filtered.length && !filtered.includes(selected)) {
            setSelected(filtered[0]);
        }
    }, [filtered, selected]);

    /* Voice search */
    const recognitionRef = useRef<any>(null);
    const [listening, setListening] = useState(false);

    useEffect(() => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) {
            console.warn("Web-Speech API missing → voice search disabled");
            return;
        }
        recognitionRef.current = new SR();
        recognitionRef.current.lang = "en-US";
        recognitionRef.current.maxAlternatives = 1;

        recognitionRef.current.onstart = () => setListening(true);
        recognitionRef.current.onresult = (e: any) => {
            const spoken = e.results[0][0].transcript;
            setQuery(spoken);
        };
        recognitionRef.current.onerror = (e: any) =>
            console.error("Speech error:", e.error);
        recognitionRef.current.onend = () => setListening(false);
    }, []);

    const toggleMic = () => {
        const rec = recognitionRef.current;
        if (!rec) return;
        if (listening) rec.stop();
        else {
            try {
                rec.start();
            } catch {
            }
        }
    };

    function play() {
        new Audio(beep).play();
    }

    /* UI */
    return (
        <div className="min-h-screen bg-white flex flex-col items-center py-8">
            <div className="w-full max-w-6xl h-[80vh] rounded-xl overflow-hidden flex flex-1 grow border-4 border-[#012D5A] rounded-md shadow-md bg-[#F1F1F1]">
                {/* LEFT column */}
                <div className="w-4/12 h-full border-r border-gray-200 flex flex-col p-5 bg-white">
                    {/* hospital buttons */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        {/* Chestnut Hill */}
                        <Button
                            className={`${
                                hospital === 0
                                    ? "bg-blue-900 text-white border-2 border-amber-600"
                                    : "bg-gray-200"
                            } rounded-md px-2 py-1`}
                            onClick={() => {
                                setHospital(0);
                                setQuery("");
                            }}
                        >
                            Chestnut Hill
                        </Button>

                        {/* Patriot Place */}
                        <Button
                            className={`${
                                hospital === 1
                                    ? "bg-blue-900 text-white border-2 border-amber-600"
                                    : "bg-gray-200"
                            } rounded-md px-2 py-1`}
                            onClick={() => {
                                setHospital(1);
                                setQuery("");
                            }}
                        >
                            Patriot Place
                        </Button>

                        {/* Faulkner */}
                        <Button
                            className={`${
                                hospital === 2
                                    ? "bg-blue-900 text-white border-2 border-amber-600"
                                    : "bg-gray-200"
                            } rounded-md px-2 py-1`}
                            onClick={() => {
                                setHospital(2);
                                setQuery("");
                            }}
                        >
                            Faulkner
                        </Button>

                        {/* Main Campus */}
                        <Button
                            className={`${
                                hospital === 3
                                    ? "bg-blue-900 text-white border-2 border-amber-600"
                                    : "bg-gray-200"
                            } rounded-md px-2 py-1`}
                            onClick={() => {
                                setHospital(3);
                                setQuery("");
                            }}
                        >
                            Main Campus
                        </Button>
                    </div>


                    {/* search bar + mic */}
                    <div className="relative mb-4 flex items-center">
                        <Input
                            placeholder="Search services or specialties…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="flex-1 grow border-2 border-[#012D5A] rounded-md shadow-md bg-[#F1F1F1]"
                        />

                        {/* mic button */}
                        <button
                            onClick={() => {
                                toggleMic();
                                play();
                            }}
                            aria-label="voice search"
                            className={`absolute top-0.5 right-3 w-8 h-8 flex items-center justify-center rounded-full border transition-colors
                        ${
                                listening
                                    ? "bg-blue-900 text-white border-blue-900"
                                    : "bg-white text-blue-900 border-blue-900"
                            }`}
                        >
                            {listening ? <MicOff size={18} /> : <Mic size={18} />}
                        </button>
                    </div>

                    {/* list */}
                    <div className="flex-1 overflow-y-auto pr-1">
                        <ul className="space-y-1">
                            {filtered.map((item) => (
                                <li key={item.name}>
                                    <Button
                                        variant="ghost"
                                        className={`w-full justify-start rounded-md px-3 py-2 text-left ${
                                            selected.name === item.name
                                                ? "bg-blue-50 font-semibold text-blue-900"
                                                : "bg-white text-black hover:bg-blue-900 hover:text-white" // hover
                                        }`}
                                        onClick={() => setSelected(item)}
                                    >
                                        {item.name}
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* RIGHT column */}
                <div className="w-8/12 p-10 overflow-y-auto flex-1 grow border-l-4 border-[#012D5A] shadow-md bg-[#F1F1F1]">
                    <h1 className="text-3xl font-bold text-blue-900 mb-6">
                        {selected.name}
                    </h1>

                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-3">Services</h2>
                        <ul className="list-disc list-inside space-y-1">
                            {selected.services.split(/,\s*(?![^()]*\))/).map((s) => (
                                <li key={s.trim()}>{s.trim()}</li>
                            ))}
                        </ul>
                    </section>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-xl font-semibold mb-1">
                                Floor&nbsp;&amp;&nbsp;Suite
                            </h2>
                            <p>{selected.room}</p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-1">Contact</h2>
                            {selected.telephone ? (
                                <a
                                    href={`tel:${selected.telephone.replace(/\D/g, "")}`}
                                    className="text-blue-700 hover:underline"
                                >
                                    {selected.telephone}
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

// this works

export default VoiceDirectory;
