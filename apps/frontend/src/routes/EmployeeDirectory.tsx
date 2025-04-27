import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Fuse from "fuse.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";

interface Employee {
    employeeId: number;
    email: string;
    firstName: string;
    middleInitial: string;
    lastName: string;
    occupation: string;
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

    return (
        <div className="min-h-screen bg-white flex flex-col items-center py-8">
            <div className="w-full max-w-6xl h-[80vh] rounded-xl shadow-md border border-gray-200 overflow-hidden flex">
                {/* ---------- Left column ---------- */}
                <div className="w-4/12 h-full border-r border-gray-200 flex flex-col p-5 bg-white">
                    {/* search bar */}
                    <Input
                        placeholder="Search employees"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="mb-4"
                    />

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