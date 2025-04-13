import GGMap from "@/GoogleMap/GoogleMap.tsx";
import React, {useEffect, useRef, useState} from 'react';

import {Input} from "@/components/ui/input.tsx";
import {API_ROUTES} from "common/src/constants.ts";
import axios from "axios";

export type Hospital = {
    hospitalId: number
    name: string
    placeId: string
    defaultZoom: number
    defaultLat: number
    defaultLng: number
    Floors: Floor[]
}

export type Floor = {
    floorId: number
    num: number
    imageURL: string
    north: number
    south: number
    east: number
    west: number
    Departments: Department[]
}

export type Department = {
    departmentId: number
    name: string
    suite: string
}

export default function Directions() {

    const departmentRef = useRef<HTMLSelectElement | null>(null);

    const [data, setData] = useState<Hospital[]>([]);

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

    const autocompleteRef = useRef<HTMLInputElement>(null);
    const [hospital, setHospital] = useState<Hospital | undefined>();
    const [floor, setFloor] = useState<Floor | undefined>();
    const [department, setDepartment] = useState<Department | undefined>();

    const handleHospitalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (departmentRef.current) {
            departmentRef.current.value = '';
        }
        for (const h of data) {
            if (h.name === e.target.value) {
                setHospital(h);
                break;
            }
        }
        setDepartment(undefined);
    }

    const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!hospital) return;
        for (const f of hospital.Floors) {
            for (const d of f.Departments) {
                if (d.name === e.target.value) {
                    setDepartment(d);
                    setFloor(f);
                    break;
                }
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
                    <hr/>
                    <br/>
                    <label htmlFor="location-dropdown">Destination Hospital</label>
                    <br/>
                    <select id="location-dropdown" name="location-dropdown" onChange={handleHospitalChange} defaultValue="">
                        <option key="0" value="" disabled>Choose a hospital</option>
                        {data.map((hospital: Hospital) => (
                            <option key={hospital.hospitalId + 1} value={hospital.name}>{hospital.name}</option>
                        ))}
                    </select>
                    {hospital && <>
                        <hr/>
                        <br/>
                        <label htmlFor="department-dropdown">Choose a location</label>
                        <br/>
                        <select id="department-dropdown" name="department-dropdown" onChange={handleDepartmentChange} defaultValue="" ref={departmentRef}>
                            <option key="0" value="" disabled>Choose here</option>
                            {hospital.Floors.map((floor: Floor) => (
                                floor.Departments.map((department: Department) => (
                                    <option key={department.name + 1} value={department.name}>{department.name}</option>))))}
                        </select>
                    </>}
                </div>
                <div className="flex-2">
                    <GGMap autoCompleteRef={autocompleteRef} hospital={hospital} floor={floor} department={department} />
                </div>
            </div>
        </>
    )
}