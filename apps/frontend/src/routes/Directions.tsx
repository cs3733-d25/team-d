import GGMap from "@/GoogleMap/GoogleMap.tsx";
import React, {useEffect, useRef, useState} from 'react';

import {Input} from "@/components/ui/input.tsx";
import {API_ROUTES} from "common/src/constants.ts";
import axios from "axios";
import {Label} from "@/components/ui/label.tsx";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.tsx";
import {Button} from "@/components/ui/button.tsx";

// export type Hospital = {
//     hospitalId: number
//     name: string
//     placeId: string
//     defaultZoom: number
//     defaultLat: number
//     defaultLng: number
//     Floors: Floor[]
// }
//
// export type Floor = {
//     floorId: number
//     num: number
//     imageURL: string
//     north: number
//     south: number
//     east: number
//     west: number
//     Departments: Department[]
// }
//
// export type Department = {
//     departmentId: number
//     name: string
//     suite: string
// }

export type Hospital = {
    hospitalId: number
    name: string
    address: string
    placeId: string
    defaultLat: number
    defaultLng: number
    defaultZoom: number
    Departments: Department[]
}

export type Department = {
    departmentId: number
    name: string
    floorNum: number
    room: string
    building: string
    lat: number
    lng: number
    Graph: Graph
}

export type Graph = {
    graphId: number
    name: string
    imageURL: string
    north: number
    south: number
    east: number
    west: number
}

export default function Directions() {

    const departmentRef = useRef(null);
    const autocompleteRef = useRef<HTMLInputElement>(null);

    const [data, setData] = useState<Hospital[]>([]);

    const [hospital, setHospital] = useState<Hospital | undefined>();
    const [graph, setGraph] = useState<Graph | undefined>();
    const [department, setDepartment] = useState<Department | undefined>();

    const [zoomFlag, setZoomFlag] = useState<boolean>(false);

    useEffect(() => {
        axios.get(API_ROUTES.DEPARTMENT).then((response) => {
            console.log('Raw:');
            console.log(response.data);
            console.log('Casted:');
            console.log(response.data as Hospital[]);
            setData(response.data as Hospital[]);
            console.log('New data: ' + data);
        })
    }, []);

    const handleHospitalChange = (value: string) => {
        // if (departmentRef.current) {
        //     // departmentRef.current.value = '';
        // }
        // for (const h of data) {
        //     if (h.name === value) {
        //         setHospital(h);
        //         break;
        //     }
        // }
        // setDepartment(undefined);
        for (const hospital of data) {
            if (hospital.name === value) {
                setHospital(hospital);
                break;
            }
        }
    }

    const handleDepartmentChange = (value: string) => {
        // if (!hospital) return;
        // for (const f of hospital.Floors) {
        //     for (const d of f.Departments) {
        //         if (d.name === value) {
        //             setDepartment(d);
        //             setFloor(f);
        //             break;
        //         }
        //     }
        // }
        if (!hospital) return;
        for (const d of hospital.Departments) {
            if (d.name === value) {
                setDepartment(d);
                setGraph(d.Graph);
            }
        }
    }

    return (
        <div className="flex flex-row flex-1">
            <div className="flex-1 p-4">
                <Label htmlFor="start-input">Start Location</Label>
                {/*<br />*/}
                <input id="start-input" ref={autocompleteRef} type="text" />

                <br />
                <br />
                {/*<hr className="my-4" />*/}

                <Label>Destination Hospital</Label>
                <Select onValueChange={handleHospitalChange}>
                    <SelectTrigger className="w-full mt-1 mb-4">
                        <SelectValue placeholder="Choose a hospital..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Hospitals</SelectLabel>
                            {data.map((h: Hospital) => (
                                <SelectItem key={h.hospitalId + 1} value={h.name}>
                                    {h.name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                {hospital && (
                    <>
                        <Label>Department</Label>
                        <Select onValueChange={handleDepartmentChange}>
                            <SelectTrigger className="w-full mt-1 mb-4">
                                <SelectValue placeholder="Choose a department..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup key="0">
                                    <SelectLabel>Departments</SelectLabel>
                                    {hospital.Departments.map((d: Department) => (
                                        <SelectItem key={d.departmentId + 1} value={d.name}>
                                            {d.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <Button onClick={() => setZoomFlag(!zoomFlag)} className="mb-4">
                            Zoom
                        </Button>
                    </>
                )}

                {/* Show Department Info if selected */}
                {/*{selectedDepartment && (*/}
                {/*    <div className="mt-4 p-2 border rounded">*/}
                {/*        <h3 className="font-bold text-lg">{selectedDepartment.service}</h3>*/}
                {/*        <p>*/}
                {/*            <strong>Specialties:</strong> {selectedDepartment.specialties}*/}
                {/*        </p>*/}
                {/*        <p>*/}
                {/*            <strong>Floor/Suite:</strong> {selectedDepartment.floorSuite}*/}
                {/*        </p>*/}
                {/*        <p>*/}
                {/*            <strong>Phone:</strong> {selectedDepartment.phone}*/}
                {/*        </p>*/}
                {/*    </div>*/}
                {/*)}*/}
            </div>

            <div className="flex-2">
                <GGMap
                    autoCompleteRef={autocompleteRef}
                    hospital={hospital}
                    department={department}
                    graph={graph}
                    zoomFlag={zoomFlag}
                />
            </div>
        </div>
    )
}