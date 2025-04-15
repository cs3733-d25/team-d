import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import axios from "axios";

import { updateDirectory } from "@/database/csv-import.ts";
import { GetDirectory } from "@/database/csv-export.ts";

type department = {
    departmentId: number;
    name: string;
    floor: number;
    suite: string;
    specialtyServices: string;
    hours: string;
    telephone: string;
};

const AdminDatabase: React.FC = () => {
    const [departments, setDepartments] = useState<department[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedHospital, setSelectedHospital] = useState<"Patriot Place" | "Chestnut Hill">("Patriot Place");

    const getDepartments = async () => {
        try {
            const { data } = await axios.get("api/department");
            setDepartments(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getDepartments();
    }, [loading]);

    const importOnClick = async () => {
        await updateDirectory();
        setLoading(true);
        const fileInput = document.getElementById("directory") as HTMLInputElement | null;
        if (fileInput) {
            fileInput.value = "";
        }
    };

    const exportOnClick = () => {
        GetDirectory();
    };

    return (
        <div className="min-h-screen w-full p-6 bg-white">
            <div className="flex items-center gap-4 mb-6">

                {/* Hospital selection buttons */}
                <Button
                    className={selectedHospital === "Patriot Place" ? "bg-blue-500 text-white" : "bg-gray-200"}
                    onClick={() => setSelectedHospital("Patriot Place")}
                >
                    Patriot Place
                </Button>
                <Button
                    className={selectedHospital === "Chestnut Hill" ? "bg-blue-500 text-white" : "bg-gray-200"}
                    onClick={() => setSelectedHospital("Chestnut Hill")}
                >
                    Chestnut Hill
                </Button>

                <Separator orientation="vertical" className="h-8 mx-4" />

                {/* Export/Import buttons and file input */}
                <Button onClick={exportOnClick}>Export as CSV</Button>
                <Input type="file" accept=".csv" className="max-w-xs" id="directory" />
                <Button onClick={importOnClick}>Import CSV</Button>

                <Separator orientation="vertical" className="h-8 mx-4" />

                {/* Table Title */}
                <h2 className="text-xl font-bold">Department Database</h2>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="px-4 py-2">Department ID</TableHead>
                        <TableHead className="px-4 py-2">Name</TableHead>
                        <TableHead className="px-4 py-2">Floor</TableHead>
                        <TableHead className="px-4 py-2">Room</TableHead>
                        <TableHead className="px-4 py-2">Building</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {departments.map((department, i) => (
                        <TableRow key={i}>
                            <TableCell className="px-4 py-2">{department.departmentId}</TableCell>
                            <TableCell className="px-4 py-2">{department.name}</TableCell>
                            <TableCell className="px-4 py-2">{department.floor}</TableCell>
                            <TableCell className="px-4 py-2">{department.suite}</TableCell>
                            <TableCell className="px-4 py-2">{department.specialtyServices}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default AdminDatabase;

















