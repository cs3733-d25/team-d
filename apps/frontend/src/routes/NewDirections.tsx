import {useEffect, useRef, useState} from "react";
import {PathfindingMap} from "@/GMap/GoogleMap.ts";
import {
    API_ROUTES,
    DepartmentOptions,
    HospitalOptions,
    PathfindingOptions,
    PathfindingResponse
} from "common/src/constants.ts";
import axios from "axios";
import {Separator} from "@/components/ui/separator.tsx";
import {Label} from "@/components/ui/label.tsx";
import {cn} from "@/lib/utils.ts";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select.tsx";
import {Button} from "@/components/ui/button.tsx";


export default function NewDirections() {

    // References for the div that holds
    // the gmap and the autocomplete input,
    // needed for compatibility w/ gmap api
    const mapRef = useRef<HTMLDivElement>(null);
    const autocompleteRef = useRef<HTMLInputElement>(null);

    const [map, setMap] = useState<PathfindingMap>();

    const [data, setData] = useState<PathfindingOptions>({
        hospitals: [],
    });

    const [hospital, setHospital] = useState<HospitalOptions | null>(null);
    const [department, setDepartment] = useState<DepartmentOptions | null>(null);

    const [pathfindingResponse, setPathfindingResponse] = useState<PathfindingResponse>();

    useEffect(() => {
        const fetchMap = async () => {
            if (mapRef.current && autocompleteRef.current ) {
                setMap(await PathfindingMap.makeMap(mapRef.current, autocompleteRef.current));
            }
        }
        fetchMap().then(() => {
            axios.get(API_ROUTES.PATHFIND + '/options/').then(response => {
                setData(response.data as PathfindingOptions);
            });
        });

    }, []);

    const handleHospitalChange = (value: string) => {
        setHospital(data.hospitals.find(h => h.name === value) || null);
    }

    const handleDepartmentChange = (value: string) => {
        if (!hospital) return;

        const newDepartment = hospital.departments.find(d => d.name === value);
        if (!newDepartment) return;
        setDepartment(newDepartment);

        if (!map) return;
        axios.get(API_ROUTES.PATHFIND + '/path-to-dept/' + newDepartment.departmentId).then(response => {
            setPathfindingResponse(response.data as PathfindingResponse);
            map.updateDepartmentPathfinding(response.data as PathfindingResponse);
        });
    }

    const handleModeChange = (value: string) => {
        if (!map) return;
        map.updateTravelMode(value);
    }

    const handleZoom = () => {
        if (!pathfindingResponse || !map) return;
        map.recenter(
            pathfindingResponse.parkingLotPath.path[0].lat,
            pathfindingResponse.parkingLotPath.path[0].lng, 17
        );
    }

    return (
        <div className="flex flex-row flex-1">
            <div className="flex-1 p-4">
                <h2 className="text-3xl font-bold">Get Directions</h2>
                <Separator className="mt-4 mb-4" />

                {/*TODO: find a better way of doing this, copied from components/ui/input.tsx*/}
                <Label className="mb-1">Start Location</Label>
                <input
                    ref={autocompleteRef}
                    id="start-input"
                    type="text"
                    data-slot="input"
                    className={cn(
                        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", "mb-4"
                    )}
                />

                {/*end to-do here*/}

                <Label>Destination Hospital</Label>
                <Select onValueChange={handleHospitalChange}>
                    <SelectTrigger className="w-full mt-1 mb-4">
                        <SelectValue placeholder="Choose a hospital..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Hospitals</SelectLabel>
                            {data.hospitals.map((h: HospitalOptions) => (
                                <SelectItem key={h.hospitalId + 1} value={h.name}>
                                    {h.name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <div className="mb-5">
                    <div id="step-instruction">Loading directions...</div>
                    <button
                        id="next-step-btn"
                        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Next Step
                    </button>
                </div>


                <Label>Transport Mode</Label>
                <Select onValueChange={handleModeChange} defaultValue="DRIVING">
                    <SelectTrigger className="w-full mt-1 mb-4">
                        <SelectValue placeholder="Choose a mode of transport..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Transport Modes</SelectLabel>
                            {['Driving', 'Walking', 'Transit', 'Bicycling'].map((mode, i) => (
                                <SelectItem key={i} value={mode.toUpperCase()}>{mode}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                {hospital &&
                    <>
                        <Separator className="mt-4 mb-4" />

                        <Label>Department</Label>
                        <Select onValueChange={handleDepartmentChange}>
                            <SelectTrigger className="w-full mt-1 mb-4">
                                <SelectValue placeholder="Choose a department..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup key="0">
                                    <SelectLabel>Departments</SelectLabel>
                                    {hospital.departments.map((d: DepartmentOptions) => (
                                        <SelectItem key={d.departmentId + 1} value={d.name}>
                                            {d.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {pathfindingResponse &&
                            <div>

                                <div className="mb-5">
                                    <div id="inner-step-instruction">Loading directions...</div>
                                    <button
                                        id="inner-next-step-btn"
                                        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Next Step
                                    </button>
                                </div>

                                <Button onClick={handleZoom} className="mb-4">
                                    Zoom
                                </Button>



                            </div>



                        }
                    </>
                }
                {/*<Separator className="mt-4 mb-4" />*/}
                {/*TODO: make a legend*/}
                {/*{!props.editor &&*/}
                {/*    <>*/}
                {/*        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">*/}
                {/*            <h2 className="text-xl font-semibold mb-3 text-gray-700 flex items-center">*/}
                {/*                Legend*/}
                {/*            </h2>*/}
                {/*            <ul className="space-y-2">*/}
                {/*                <li className="flex items-center text-lg">*/}
                {/*                    <FontAwesomeIcon icon={faCar} className="text-blue-500 w-4 h-4 mr-3" />*/}
                {/*                    To Hospital*/}
                {/*                </li>*/}
                {/*                <li className="flex items-center text-lg">*/}
                {/*                    <FontAwesomeIcon icon={faWalking} className="text-red-600 w-4 h-4 mr-3" />*/}
                {/*                    Within Hospital*/}
                {/*                </li>*/}
                {/*            </ul>*/}
                {/*        </div>*/}
                {/*    </>*/}
                {/*}*/}
            </div>
            <div ref={mapRef} className="flex-3">
                {/* Google map will go here */}
            </div>
        </div>
    );
}

declare global {
    interface Window {
        initMap: () => void;
        google: typeof google;
    }
}