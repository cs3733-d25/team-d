import React, { useEffect, useMemo, useRef, useState } from "react";
import Fuse from "fuse.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, MicOff } from "lucide-react";
import beep from "../components/beep.mp3";
import axios from "axios";
import {API_ROUTES} from "common/src/constants.ts";

// import {SpeechRecognition} from 'dom-speech-recognition';
// import SpeechRecognition from "react-speech-recognition";
// import web
/* Browser type helpers */
// TODO
declare global {
    interface Window {
        webkitSpeechRecognition: typeof SpeechRecognition;
        SpeechRecognition: typeof SpeechRecognition;
    }
}

type Entry = {
    name: string;
    services: string;
    room: string;
    floorNum: number;
    telephone: string;
};

const chestnutData: Entry[] = (await axios.get(API_ROUTES.DEPARTMENT+"/hospital/0")).data;

const patriotData: Entry[] = (await axios.get(API_ROUTES.DEPARTMENT+"/hospital/1")).data.map((entry: Entry) => ({
    ...entry,
    services: entry.services ?? "",
    telephone: entry.telephone ?? ""
}));

/* Faulkner Hospital */
const faulknerData: Entry[] = (await axios.get(API_ROUTES.DEPARTMENT+"/hospital/2")).data.map((entry: Entry) => ({
    ...entry,
    services: entry.services ?? "",
    telephone: entry.telephone ?? ""
}));

/* Brigham Main Campus */
const mainCampusData: Entry[] = (await axios.get(API_ROUTES.DEPARTMENT+"/hospital/3")).data.map((entry: Entry) => ({
    ...entry,
    services: entry.services ?? "",
    telephone: entry.telephone ?? ""
}));


/* Fuse helper  */
const createFuse = (data: Entry[]) =>
    new Fuse(data, {
        keys: ["name", "services"],
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
    // TODO
    const recognitionRef = useRef<SpeechRecognition | null>(null)
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

        // TODO
        recognitionRef.current.onstart = () => setListening(true);
        recognitionRef.current.onresult = (e: SpeechRecognitionEvent) => {
            const spoken = e.results[0][0].transcript;
            setQuery(spoken);
        };

        // TODO
        recognitionRef.current.onerror = (e: SpeechRecognitionErrorEvent) =>
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
                        <h2 className="text-xl p-2 font-semibold mb-3 b-1 border-2 border-amber-600 rounded-md inline-block">Services</h2>
                        <ul className="list-disc list-inside space-y-1">
                            {selected.services.split(/,\s*(?![^()]*\))/).map((s) => (
                                <li key={s.trim()}>{s.trim()}</li>
                            ))}
                        </ul>
                    </section>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-xl p-2 font-semibold mb-3 b-1 border-2 border-amber-600 rounded-md inline-block">
                                Floor&nbsp;&amp;&nbsp;Suite
                            </h2>
                            <p>Floor {selected.floorNum} Suite {selected.room}</p>
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
