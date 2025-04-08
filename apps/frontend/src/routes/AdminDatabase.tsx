import React, { useRef, useState } from "react";
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

const AdminDatabase: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [inputKey, setInputKey] = useState<number>(Date.now()); // Used to reset file input

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setSelectedFile(file);
    };

    const handleImportCSV = () => {
        if (!selectedFile) {
            alert("No file selected!");
            return;
        }

        alert(`Importing file: ${selectedFile.name}`);

        setSelectedFile(null);
        setInputKey(Date.now()); // Resets the input by changing key
    };

    return (
        <div className="min-h-screen w-full p-6 bg-white">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="default">Export as CSV</Button>

                {/* "Choose file" input for CSV */}
                <Input
                    key={inputKey}
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    className="max-w-xs"
                    onChange={handleFileChange}
                />

                <Button variant="default" onClick={handleImportCSV}>
                    Import CSV
                </Button>

                {/* Vertical Separator */}
                <Separator orientation="vertical" className="h-8 mx-4" />

                {/* Table Title */}
                <h2 className="text-xl font-bold">Department Database</h2>
            </div>

            {/* Data table (headers only for now) */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-32">Department ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Floor</TableHead>
                        <TableHead>Suite</TableHead>
                        <TableHead>Specialty Services</TableHead>
                        <TableHead>Hours</TableHead>
                        <TableHead>Telephone</TableHead>
                    </TableRow>
                </TableHeader>

                {/* Empty table body for now */}
                <TableBody>
                    {/* Placeholder for future rows */}
                </TableBody>
            </Table>
        </div>
    );
};

export default AdminDatabase;






