import React, { useMemo, useState, useEffect } from "react";
import Fuse from "fuse.js"; //yarn add fuse.js
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const directoryData = [
    {
        service: "Allergy and Clinical Immunology",
        specialties:
            "Allergy, (environmental, food, medication, and venoms), asthma, anaphylaxis, angioedema, sinusitis, and immunodeficiency",
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
            "Crohn's disease, inflammatory bowel disease, infusion services, microscopic colitis, pulmonary, rheumatology, ulcerative colitis",
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

const fuse = new Fuse(directoryData, {
    keys: ["service", "specialties"],
    threshold: 0.35,
    ignoreLocation: true,
});

const ChestnutHillDirectory: React.FC = () => {
    const [hospital, setHospital] = useState<0 | 1>(0);
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState(directoryData[0]);

    /* filter via Fuse.js */
    const filtered = useMemo(() => {
        const q = query.trim();
        return q ? fuse.search(q).map((r) => r.item) : directoryData;
    }, [query]);

    useEffect(() => {
        if (filtered.length && !filtered.includes(selected)) setSelected(filtered[0]);
    }, [filtered, selected]);

    return (
        <div className="min-h-screen bg-white flex flex-col items-center py-8">
            <div className="w-full max-w-6xl h-[80vh] rounded-xl shadow-md border border-gray-200 overflow-hidden flex">
                {/* Left column */}
                <div className="w-4/12 h-full border-r border-gray-200 flex flex-col p-5 bg-white">
                    {/* hospital buttons */}
                    <div className="flex gap-3 mb-4">
                        <Button
                            className={`flex-1 px-4 py-2 text-base ${
                                hospital === 0 ? "bg-blue-600 text-white" : "bg-gray-200"
                            }`}
                            onClick={() => setHospital(0)}
                        >
                            Chestnut Hill
                        </Button>
                        <Button
                            className={`flex-1 px-4 py-2 text-base ${
                                hospital === 1 ? "bg-blue-600 text-white" : "bg-gray-200"
                            }`}
                            onClick={() => setHospital(1)}
                        >
                            Patriot Place
                        </Button>
                    </div>

                    {/* search bar */}
                    <Input
                        placeholder="Search services or specialties…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="mb-4"
                        disabled={hospital === 1}
                    />

                    {/* list (only for Chestnut Hill) */}
                    {hospital === 0 ? (
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
                    ) : (
                        <p className="text-gray-500 text-sm mt-4">
                            Patriot Place directory coming soon…
                        </p>
                    )}
                </div>

                {/*  Right column */}
                <div className="w-8/12 p-10 overflow-y-auto">
                    {hospital === 0 ? (
                        <>
                            <h2 className="text-3xl font-bold text-blue-900 mb-6">
                                {selected.service}
                            </h2>

                            <section className="mb-8">
                                <h3 className="text-xl font-semibold mb-3">Services</h3>
                                <ul className="list-disc list-inside space-y-1">
                                    {selected.specialties.split(/[,•]/).map((s) => (
                                        <li key={s.trim()}>{s.trim()}</li>
                                    ))}
                                </ul>
                            </section>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-xl font-semibold mb-1">Floor&amp;Suite</h3>
                                    <p>{selected.floorSuite}</p>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-1">Contact</h3>
                                    <a
                                        href={`tel:${selected.phone.replace(/\D/g, "")}`}
                                        className="text-blue-700 hover:underline"
                                    >
                                        {selected.phone}
                                    </a>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <p className="text-xl text-gray-600">
                                Patriot Place directory coming soon…
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChestnutHillDirectory;
