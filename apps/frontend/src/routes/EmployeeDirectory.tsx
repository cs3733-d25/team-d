import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Fuse from "fuse.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, MicOff } from "lucide-react";
import beep from "../components/beep.mp3";
import axios from "axios";

interface Employee {
    employeeId: number;
    email: string;
    firstName: string;
    middleInitial: string;
    lastName: string;
    occupation: string;
    DOB: string;
    Gender: string;
    Pronouns: string;
    PhoneNumber: string;

}


export default function ShowAllEmployees() {
    const navigate = useNavigate();
    const [employeeData, setEmployeeData] = useState<Employee[]>([]);
    const [query, setQuery] = useState<string>("");
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);



    useEffect(() => {
       const fetchData = async () => {
            try {
                const response = await axios.get('/api/employee'); //the api
                setEmployeeData(response.data);
                setSelectedEmployee(response.data[0]); // default selected to first employee
            } catch (error) {
                console.error('Error fetching employees', error);
           }
        };
        fetchData();
    }, []);



    /* Fuse.js dynamic fuzzy search instance */
    const fuse = useMemo(() => {
        return new Fuse(employeeData, {
            keys: ["firstName", "lastName", "email", "occupation", "employeeId"],
            threshold: 0.3,
            ignoreLocation: true,
        });
    }, [employeeData]);

    /* filter list */
    const filtered = useMemo(() => {
        const q = query.trim();
        return q ? fuse.search(q).map((r) => r.item) : employeeData;
    }, [fuse, query, employeeData]);

    /* keep details pane in sync with first match */
    useEffect(() => {
        if (filtered.length && (!selectedEmployee || !filtered.find(emp => emp.employeeId === selectedEmployee.employeeId))) {
            setSelectedEmployee(filtered[0]);
        }
    }, [filtered, selectedEmployee]);

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


    return (
        <div className="min-h-screen bg-white flex flex-col items-center py-8">
            <div className="w-full max-w-6xl h-[80vh] rounded-xl shadow-md border border-gray-200 overflow-hidden flex">
                {/* ---------- Left column ---------- */}
                <div className="w-4/12 h-full border-r border-gray-200 flex flex-col p-5 bg-white">
                    {/* search bar */}
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

                    {/* scrollable list */}
                    <div className="flex-1 overflow-y-auto pr-1">
                        <ul className="space-y-1">
                            {filtered.map((employee) => (
                                <li key={employee.employeeId}>
                                    <Button
                                        variant="ghost"
                                        className={`w-full justify-start rounded-md px-3 py-2 text-left ${
                                            selectedEmployee?.employeeId === employee.employeeId
                                                ? "bg-blue-50 font-semibold text-blue-900"
                                                : "bg-white text-black hover:bg-gray-100 hover:text-black"
                                        }`}
                                        onClick={() => setSelectedEmployee(employee)}
                                    >
                                        {employee.firstName} {employee.lastName}
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* ---------- Right column ---------- */}
                <div className="w-8/12 p-10 overflow-y-auto">
                    {selectedEmployee && (
                        <>
                            <h1 className="text-3xl font-bold text-blue-900 mb-6">
                                {selectedEmployee.firstName} {selectedEmployee.middleInitial}. {selectedEmployee.lastName}
                            </h1>
                            <section className="mb-8">
                                <h2 className="text-xl font-semibold">Employee ID:</h2>
                                <p>{selectedEmployee.employeeId}</p>
                            </section>
                            <section className="mb-8">
                                <h2 className="text-xl font-semibold">Occupation:</h2>
                                <p>{selectedEmployee.occupation}</p>
                            </section>
                            <section className="mb-8">
                                <h2 className="text-xl font-semibold">Date of Birth:</h2>
                                <p>{selectedEmployee.DOB}</p>
                            </section>
                            <section className="mb-8">
                                <h2 className="text-xl font-semibold">Gender:</h2>
                                <p>{selectedEmployee.Gender}</p>
                            </section>
                            <section className="mb-8">
                                <h2 className="text-xl font-semibold">Phone Number:</h2>
                                <p>{selectedEmployee.PhoneNumber}</p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-xl font-semibold">Pronouns:</h2>
                                <p>{selectedEmployee.Pronouns}</p>
                            </section>
                            <div>
                                <h2 className="text-xl font-semibold">Email:</h2>
                                <a
                                    href={`mailto:${selectedEmployee.email}`}
                                    className="text-blue-700 hover:underline"
                                >
                                    {selectedEmployee.email}
                                </a>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};