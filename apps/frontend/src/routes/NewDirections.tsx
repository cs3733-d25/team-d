import {useEffect, useRef, useState} from "react";
import {DirectionsStep, PathfindingMap, PathfindingResults} from "@/GMap/GoogleMap.ts";
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

    // 'backend' for google map
    const [map, setMap] = useState<PathfindingMap>();

    // all hospitals and their departments
    const [displayData, setDisplayData] = useState<PathfindingOptions>({
        hospitals: [],
    });

    // for storing current selection
    const [selectedHospital, setSelectedHospital] = useState<HospitalOptions | null>(null);
    const [selectedDepartment, setSelectedDepartment] = useState<DepartmentOptions | null>(null);

    const [pathfindingResults, setPathfindingResults] = useState<PathfindingResults | null>(null);

    // const [pathfindingResponse, setPathfindingResponse] = useState<PathfindingResponse>();
    //
    // const [directionsSteps, setDirectionsSteps] = useState<DirectionsStep[]>([]);

    useEffect(() => {
        console.log('useEffect NewDirections');
        const fetchMap = async () => {
            if (mapRef.current && autocompleteRef.current ) {
                setMap(await PathfindingMap.makeMap(mapRef.current, autocompleteRef.current, setPathfindingResults));
            }
        }
        fetchMap().then(() => {
            axios.get(API_ROUTES.PATHFIND + '/options/').then(response => {
                setDisplayData(response.data as PathfindingOptions);
            });
        });

    }, []);

    const handleHospitalChange = (value: string) => {
        setSelectedHospital(displayData.hospitals.find(h => h.name === value) || null);
    }

    const handleDepartmentChange = (value: string) => {
        if (!selectedHospital) return;

        const newDepartment = selectedHospital.departments.find(d => d.name === value);
        if (!newDepartment) return;
        setSelectedDepartment(newDepartment);

        if (!map) return;
        map.setDepartment(newDepartment);
    }

    const handleModeChange = (value: string) => {
        if (!map) return;
        map.setTravelMode(value);
    }

    const handleZoom = () => {
        // if (!pathfindingResponse || !map) return;
        // map.recenter(
        //     pathfindingResponse.parkingLotPath.path[0].lat,
        //     pathfindingResponse.parkingLotPath.path[0].lng, 20
        // );
    }

    const handleStepSelect = () => {

    }

    return (
        <div className="flex flex-row flex-1 h-screen overflow-y-hidden">
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
                            {displayData.hospitals.map((h: HospitalOptions) => (
                                <SelectItem key={h.hospitalId + 1} value={h.name}>
                                    {h.name}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>


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


                {selectedHospital &&
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
                                    {selectedHospital.departments.map((d: DepartmentOptions) => (
                                        <SelectItem key={d.departmentId + 1} value={d.name}>
                                            {d.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </>
                }

                {pathfindingResults?.directions.map((step, i) => (
                    <div onClick={() => {
                        map?.setCurrentStepIdx(i, true);
                    }}>{step.instructions} | {step.distance} | {step.time} | {step.icon}</div>
                ))}
            </div>
            <div ref={mapRef} className="flex-3">
                {/* Google map will go here */}
            </div>
        </div>
    );
}