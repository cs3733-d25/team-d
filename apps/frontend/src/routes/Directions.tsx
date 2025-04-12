import GGMap from "@/GoogleMap/GoogleMap.tsx";
import React, {useRef, useState} from 'react';
import {Input} from "@/components/ui/input.tsx";

export type Department = {
    name: string;
    floor: number;
}

export type Hospital = {
    name: string;
    placeId: string;
    departments: Department[];
}

export default function Directions() {

    // const [selected, setSelected] = useState<Hospital | null>(null);

    const data: Hospital[] = [
        {
            name: 'Chestnut Hill',
            placeId: 'ChIJLwkLvP5444kRGTnWxi0zsnM',
            departments: [
                {
                    name: 'Laboratory',
                    floor: 1,
                },
                {
                    name: 'Multi-Specialty Clinic',
                    floor: 1,
                },
                {
                    name: 'Radiology, MRI/CT scan',
                    floor: 1,
                },
            ],
        },
        {
            name: '20 Patriot Place',
            placeId: 'ChIJHzla42V95IkR_bz0ni4NvfI',
            departments: [
                {
                    name: 'Blood Draw/Phlebotomy',
                    floor: 1,
                },
                {
                    name: 'Pharmacy',
                    floor: 1,
                },
                {
                    name: 'Radiology',
                    floor: 1,
                },
                {
                    name: 'Cardiovascular Services',
                    floor: 1,
                },
                {
                    name: 'Urology',
                    floor: 1,
                },
                {
                    name: 'Urgent Care Center',
                    floor: 1,
                },
            ],
        },
        {
            name: '22 Patriot Place',
            placeId: 'ChIJKQrcBrd85IkRhhpDZMarvhQ',
            departments: [
                {
                    name: 'Laboratory',
                    floor: 1,
                },
                {
                    name: 'Multi-Specialty Clinic',
                    floor: 1,
                },
            ],
        },
    ];

    const autocompleteRef = useRef<HTMLInputElement>(null);
    const [hospital, setHospital] = useState<Hospital | undefined>();
    const [department, setDepartment] = useState<Department | undefined>();

    const handleHospitalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
        for (const d of hospital.departments) {
            if (d.name === e.target.value) {
                setDepartment(d);
                break;
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
                    <select id="location-dropdown" name="location-dropdown" onChange={handleHospitalChange}>
                        <option value="" selected disabled>Choose a hospital</option>
                        {data.map((hospital: Hospital) => (
                            <option value={hospital.name}>{hospital.name}</option>
                        ))}
                        {/*<option value="Chestnut Hill">Chestnut Hill</option>*/}
                        {/*<option value="20 Patriot Place">20 Patriot Place</option>*/}
                        {/*<option value="22 Patriot Place">22 Patriot Place</option>*/}
                    </select>
                    {hospital && <>
                        <hr/>
                        <br/>
                        <label htmlFor="department-dropdown">Choose a location</label>
                        <br/>
                        <select id="department-dropdown" name="department-dropdown" onChange={handleDepartmentChange}>
                            <option value="" selected disabled>Choose here</option>
                            {hospital.departments.map((department: Department) => (
                                <option value={department.name}>{department.name}</option>
                            ))}
                        </select>
                    </>}
                </div>
                <div className="flex-2">
                    <GGMap autoCompleteRef={autocompleteRef} hospital={hospital} department={department} />
                </div>
            </div>
        </>
    )
}