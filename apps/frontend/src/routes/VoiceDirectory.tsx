import React, { useEffect, useMemo, useRef, useState } from "react";
import Fuse from "fuse.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, MicOff } from "lucide-react";
import beep from "../components/beep.mp3";

/* Browser type helpers */
declare global {
    interface Window {
        webkitSpeechRecognition: any;
        SpeechRecognition: any;
    }
}

type Entry = {
    service: string;
    specialties: string;
    floorSuite: string;
    phone: string;
};

const chestnutData: Entry[] = [
    {
        service: "Allergy and Clinical Immunology",
        specialties:
            "Allergy, Environmental, Food, Medication, Venoms, Asthma, Anaphylaxis, Angioedema, Sinusitis, Immunodeficiency",
        floorSuite: "3rd floor, suite 301 & 5th floor, suite 540",
        phone: "(617) 732–9850",
    },
    {
        service: "Child Care Center (Mon–Fri, 8 a.m.–4:30 p.m.)",
        specialties: "Backup childcare for employees",
        floorSuite: "2nd floor, suite 210",
        phone: "(617) 732–9543",
    },
    {
        service: "Brigham Dermatology Associates (BDA)",
        specialties: "Medical and surgical dermatology",
        floorSuite: "3rd floor, suite 317",
        phone: "(617) 732–9080",
    },
    {
        service: "Brigham Obstetrics and Gynecology Group (BOGG)",
        specialties: "Gynecology, Obstetrics",
        floorSuite: "5th floor, suite 575",
        phone: "(617) 732–9100",
    },
    {
        service: "Brigham Physicians Group (BPG)",
        specialties: "Adult Primary Care",
        floorSuite: "4th floor, suite 428 & 5th floor, suite 530",
        phone: "(617) 732–9900",
    },
    {
        service: "Brigham Psychiatric Specialities",
        specialties: "Psychiatry, Psychology, Social Work",
        floorSuite: "3rd floor, suite 303",
        phone: "(617) 732–9811",
    },
    {
        service: "Center for Pain Medicine",
        specialties: "Multidisciplinary pain management",
        floorSuite: "3rd floor, suite 320",
        phone: "(617) 732–9060",
    },
    {
        service: "Crohn's and Colitis Center",
        specialties:
            "Crohn's disease, Inflammatory bowel disease, Infusion services, Microscopic colitis, Pulmonary, Rheumatology, Ulcerative colitis",
        floorSuite: "2nd floor, suite 201",
        phone: "(617) 732–6389",
    },
    {
        service: "Endoscopy Center",
        specialties:
            "Bacterial overgrowth breath test, colonoscopy, H. pylori breath test, lactose malabsorption breath test, upper endoscopy",
        floorSuite: "2nd floor, suite 202",
        phone: "(617) 732–7426",
    },
    {
        service: "Gretchen S. and Edward A. Fish Center for Women's Health",
        specialties:
            "Cardiology, Dermatology (cosmetic, medical, and surgical), Endocrinology, Gastroenterology, Gynecology, Hematology, Infectious Diseases, Mental Health (social work), General neurology, Nutrition, Primary care, Pulmonary, Renal, Rheumatology, Sleep medicine, Women's Health (Menopause and Midlife Clinic, Obstetric Internal Medicine)",
        floorSuite: "4th floor, suite 402",
        phone: "(617) 732–9300",
    },
    {
        service: "Laboratory (Mon–Fri, 7 a.m.–7 p.m.; Sat, 7 a.m.–3 p.m.)",
        specialties: "Blood work, lab services",
        floorSuite: "1st floor, suite 100",
        phone: "(617) 732–9841",
    },
    {
        service: "Multi-Specialty Clinic",
        specialties:
            "Orthopedic surgery, Vascular surgery, Contact Dermatitis and Occupational Dermatology Program, Pain Medicine and Travel Medicine",
        floorSuite: "1st floor, suite 130",
        phone: "(617) 732–9500",
    },
    {
        service: "Osher Clinical Center for Integrative Health",
        specialties:
            "Acupuncture, health coaching, chiropractic, craniosacral therapy, integrative medicine, structural massage & movement therapies, neurology (movement disorders and headache), echocardiography, and pulmonary. Educational courses: Integrative wellness courses are also offered.",
        floorSuite: "4th floor, suite 422",
        phone: "(617) 732–9700",
    },
    {
        service: "Patient Financial Services",
        specialties: "Patient financial counselling (Payment, Insurance, Billing questions)",
        floorSuite: "2nd floor, suite 204-B",
        phone: "(617) 732–9677",
    },
    {
        service: "Pharmacy (Monday - Friday, 9 am-4 pm excluding holidays)",
        specialties: "Outpatient Pharmacy Service",
        floorSuite: "3rd floor, suite 317",
        phone: "(617) 732–9040",
    },
    {
        service: "Radiology",
        specialties: "Bone Density, Breast Imaging/Mammography, Ultrasound, X-Ray",
        floorSuite: "5th floor, suite 560",
        phone: "(617) 732–9801",
    },
    {
        service: "Radiology, MRI/CT scan",
        specialties: "CT scan, MRI, X-Ray",
        floorSuite: "1st floor, suite 102-B",
        phone: "(617) 732–9821",
    },
    {
        service: "Rehabilitation Services",
        specialties:
            "Orthopedic, sports, neurologic and vestibular Physical Therapy, Men's and Women's pelvic floor Physical Therapy. Hand/Occupational, Therapy Speech Language Pathology",
        floorSuite: "2nd floor, suite 200",
        phone: "(617) 732–9525",
    },
];

const patriotData: Entry[] = [
    {
        service: "Day Surgery Center",
        specialties:
            "Electromyograph(EMG), Nutrion, Pain Medicine, Physiatry, Pulmonary Function Testing, Blood Draw/Phlebotomy, Community Room, Primary",
        floorSuite: "20 & 22 Patriot Place, 4th floor",
        phone: "",
    },
    {
        service: "Surgical Specialities",
        specialties: "Audiology, ENT, Genereal and Gastrointestinal Surgery, Plastic Surgery, Thoracic Surgery, Vascular Surgery, Weight Management and Wellness",
        floorSuite: "20 Patriot Place, 3rd floor",
        phone: "",
    },
    {
        service: "Sports Medicine Center",
        specialties: "X-Ray Suite",
        floorSuite: "20 Patriot Place, 3rd floor",
        phone: "",
    },
    {
        service: "Multi Specialty Clinic",
        specialties: "Allergy, Cardiac Arrhythmia, Dermatology, Endocrinology, Gastroenterology, Kidney (Renal) Medicine, Neurology, Neurosurgery, Ophthalmology, Optometry, Pulmonology, Rheumatology, Women's Health, Patient Financial Seervices",
        floorSuite: "22 Patriot Place, 3rd floor",
        phone: "",
    },
    {
        service: "Orthopaedics",
        specialties: "Hand and Upper Extremity, Arthroplasty, Pediatric Trauma, Physiatry, Podiatry",
        floorSuite: "20 Patriot Place, 2nd floor",
        phone: "",
    },
    {
        service: "Rehabilitation Services",
        specialties: "Cardiac Rehab, Occupational Therapy (Hand and Upper Extremity), Physical Therapy, Speech - Language, Clinical Lab, Surgi-Care",
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
/* Fuse helper  */
const createFuse = (data: Entry[]) =>
    new Fuse(data, {
        keys: ["service", "specialties"],
        threshold: 0.35,
        ignoreLocation: true,
    });

const VoiceDirectory: React.FC = () => {
    /* directory state */
    const [hospital, setHospital] = useState<0 | 1>(0);
    const data = hospital === 0 ? chestnutData : patriotData;

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
                    <div className="flex gap-3 mb-4">
                        <Button
                            className={`flex-1 ${
                                hospital === 0 ? "bg-blue-900 text-white  mb-1 mb-2 border-2 border-amber-600 rounded-md inline-block px-2 py-1" : "bg-gray-200"
                            }`}
                            onClick={() => {
                                setHospital(0);
                                setQuery("");
                            }}
                        >
                            Chestnut Hill
                        </Button>
                        <Button
                            className={`flex-1 ${
                                hospital === 1 ? "bg-blue-900 text-white mb-1 mb-2 border-2 border-amber-600 rounded-md inline-block px-2 py-1" : "bg-gray-200"
                            }`}
                            onClick={() => {
                                setHospital(1);
                                setQuery("");
                            }}
                        >
                            Patriot Place
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
                                <li key={item.service}>
                                    <Button
                                        variant="ghost"
                                        className={`w-full justify-start rounded-md px-3 py-2 text-left ${
                                            selected.service === item.service
                                                ? "bg-blue-50 font-semibold text-blue-900"
                                                : "bg-white text-black hover:bg-gray-100"
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

                {/* RIGHT column */}
                <div className="w-8/12 p-10 overflow-y-auto flex-1 grow border-l-4 border-[#012D5A] shadow-md bg-[#F1F1F1]">
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
                            <h2 className="text-xl font-semibold mb-1">
                                Floor&nbsp;&amp;&nbsp;Suite
                            </h2>
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

// this works

export default VoiceDirectory;
