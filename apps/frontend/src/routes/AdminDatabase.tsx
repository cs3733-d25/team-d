import React from "react";
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
import {GetDirectory} from "@/database/csv-export.ts";
import {updateDirectory} from "@/database/csv-import.ts";
import { useState, useEffect } from 'react';
import axios from "axios";

type Building = {
    buildingId: string;
    name: string;
}

type FloorGraph = {
    stuff: string;
    Building: Building;
}

type Department = {
    departmentId: number;
    name: string;
    floorNum: number;
    room: string;
    FloorGraph: FloorGraph;
}

const AdminDatabase: React.FC = () => {
    const [departments, currDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = React.useState(false); // true means it needs to reload
    const [selectedBuilding, setSelectedBuilding] = useState<0 | 1 | 2 | 3>(3);


    //getting department data for display
    const getDepartments = async() => {
        try{
            let data;
            if(selectedBuilding == 3){
                data = await axios.get('api/department');
            }else {
                data = await axios.get('api/department/specbuilding/'+selectedBuilding);
            }
            currDepartments(data.data);
            setLoading(false);
        }catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        getDepartments().then();
    }, [loading,selectedBuilding]);
    //makes sure that the display updates everytime new data is imported
    const  importOnClick = async () => {
        await updateDirectory();
        await setLoading(true);
    }
    return (
        <div className="min-h-screen w-full p-6 bg-white">
            <div className="flex items-center gap-4 mb-6">

                {/* Hospital selection buttons */}
                <Button
                    className={selectedBuilding === 0 ? "bg-blue-500 text-white" : "bg-gray-200"}
                    onClick={() => setSelectedBuilding(0)}
                >
                    Chestnut Hill
                </Button>
                <Button
                    className={selectedBuilding === 1 ? "bg-blue-500 text-white" : "bg-gray-200"}
                    onClick={() => setSelectedBuilding(1)}
                >
                    20 Patriot Place
                </Button>
                <Button
                    className={selectedBuilding === 2 ? "bg-blue-500 text-white" : "bg-gray-200"}
                    onClick={() => setSelectedBuilding(2)}
                >
                    22 Patriot Place
                </Button>
                <Button
                    className={selectedBuilding === 3 ? "bg-blue-500 text-white" : "bg-gray-200"}
                    onClick={() => setSelectedBuilding(3)}
                >
                    All
                </Button>

                <Separator orientation="vertical" className="h-8 mx-4" />
                {/* Export/Import buttons and file input */}
                <Button onClick={() => GetDirectory()}>Export as CSV</Button>
                <Input type="file" accept=".csv" className="max-w-xs" id="directory"/>
                <Button onClick={() => importOnClick()}>Import CSV</Button>

                {/* Vertical Separator */}
                <Separator orientation="vertical" className="h-8 mx-4" />

                {/* Table Title */}
                <h2 className="text-xl font-bold">Department Database</h2>
            </div>

            {/* Data table (headers only for now) */}
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
                    {departments.map((department,i) => (
                        <TableRow key={i}>
                            <TableCell>{department.departmentId}</TableCell>
                            <TableCell>{department.name}</TableCell>
                            <TableCell>{department.floorNum}</TableCell>
                            <TableCell>{department.room}</TableCell>
                            <TableCell>{department.FloorGraph.Building.name}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default AdminDatabase;



