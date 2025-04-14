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
    defaultLat: string
    defaultLng: string
    defaultZoom: number
    Departments: Department[]
}

export type Department = {
    departmentId: number
    name: string
    floorNum: number
    room: string
    building: string
    lat: string
    lng: string
    Graph: Graph
}

export type Graph = {
    graphId: number
    name: string
    imageUrl: string
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
        <>
            <div className="flex-1 flex flex-row">
                <div className="flex-1">
                    <label htmlFor="start-input">Start Location</label>
                    <br/>
                    <input id="start-input" ref={autocompleteRef} type="text" />
                    {/*<hr/>*/}
                    {/*<br/>*/}
                    {/*<label htmlFor="location-dropdown">Destination Hospital</label>*/}
                    {/*<br/>*/}
                    {/*<select id="location-dropdown" name="location-dropdown" onChange={handleHospitalChange} defaultValue="">*/}
                    {/*    <option key="0" value="" disabled>Choose a hospital</option>*/}
                    {/*    {data.map((hospital: Hospital) => (*/}
                    {/*        <option key={hospital.hospitalId + 1} value={hospital.name}>{hospital.name}</option>*/}
                    {/*    ))}*/}
                    {/*</select>*/}
                    {/*{hospital &&*/}
                    {/*    <>*/}
                    {/*        <hr/>*/}
                    {/*        <br/>*/}
                    {/*        <label htmlFor="department-dropdown">Choose a location</label>*/}
                    {/*        <br/>*/}
                    {/*        <select id="department-dropdown" name="department-dropdown" onChange={handleDepartmentChange} defaultValue="" ref={departmentRef}>*/}
                    {/*            <option key="0" value="" disabled>Choose here</option>*/}
                    {/*            {hospital.Floors.map((floor: Floor) => (*/}
                    {/*                floor.Departments.map((department: Department) => (*/}
                    {/*                    <option key={department.name + 1} value={department.name}>{department.name}</option>))))}*/}
                    {/*        </select>*/}
                    {/*    </>*/}
                    {/*}*/}
                    {/*{hospital &&*/}
                    {/*    <>*/}
                    {/*        <hr/>*/}
                    {/*        <br/>*/}
                    {/*        <button onClick={() => setZoomFlag(!zoomFlag)}>Zoom to Hospital</button>*/}
                    {/*    </>*/}
                    {/*}*/}
                    <br/>
                    <hr/>
                    <br/>

                    <Label>
                        Destination Hospital
                        <Select onValueChange={handleHospitalChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose a hospital..." defaultValue="0"></SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup key="0">
                                    <SelectLabel>Hospitals</SelectLabel>
                                    {data.map((h: Hospital) => (
                                        <SelectItem key={h.hospitalId + 1} value={h.name}>{h.name}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Label>

                    {hospital &&
                        <>
                            <Label>
                                Department
                                <Select onValueChange={handleDepartmentChange}>
                                    <SelectTrigger>
                                        <SelectValue defaultValue="0" placeholder="Choose a department..."></SelectValue>
                                    </SelectTrigger>
                                    <SelectContent ref={departmentRef}>
                                        <SelectGroup>
                                            <SelectLabel>Departments</SelectLabel>
                                            {hospital.Departments.map((d: Department) => (
                                                <SelectItem key={d.departmentId + 1} value={d.name}>{d.name}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Label>
                            <Button onClick={() => setZoomFlag(!zoomFlag)}>Zoom</Button>
                        </>
                    }
                </div>
                <div className="flex-2">
                    {/*<GGMap autoCompleteRef={autocompleteRef} hospital={hospital} floor={floor} department={department} zoomFlag={zoomFlag} />*/}
                </div>
            </div>
        </>
    )
}