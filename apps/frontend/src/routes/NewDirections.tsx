import {useEffect, useRef, useState} from "react";
import {DirectionsStep, PathfindingMap, PathfindingResults} from "@/GMap/GoogleMap.ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar, faWalking, faBus, faBicycle } from "@fortawesome/free-solid-svg-icons";
import {Switch} from '@/components/ui/switch.tsx';
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
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface TransportModeOption {
    value: string;
    label: string;
    icon: IconDefinition; // You might want to be more specific with the icon type
}

//const primaryDarkBlue = "#012D5A";
//const primaryOrange = "#D47F00";
const transportModes: TransportModeOption[] = [
    { value: "DRIVING", label: "Driving", icon: faCar },
    { value: "WALKING", label: "Walking", icon: faWalking },
    { value: "TRANSIT", label: "Transit", icon: faBus },
    { value: "BICYCLING", label: "Bicycling", icon: faBicycle },
];

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

    const [tts, setTts] = useState<boolean>(false);

    // const [pathfindingResponse, setPathfindingResponse] = useState<PathfindingResponse>();
    //
    // const [directionsSteps, setDirectionsSteps] = useState<DirectionsStep[]>([]);
    // const [pathfindingResponse, setPathfindingResponse] = useState<PathfindingResponse>();
    const [selectedMode, setSelectedMode] = useState<string>("DRIVING");

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

    const handleModeChange = (mode: string) => {
        setSelectedMode(mode);
        if (!map) return;
        map.setTravelMode(mode);
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
            <div className="flex-1 p-4 overflow-y-scroll">
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


                <Label className="mb-2">Transport Mode</Label>
                <div className="flex flex-col items-center justify-center gap-6 rounded-md shadow-md p-4 bg-[#012D5A] mb-4"> {/* Rounded box container */}
                    <div className="flex gap-6">
                        {transportModes.map((mode) => (
                            <button
                                key={mode.value}
                                onClick={() => handleModeChange(mode.value)}
                                className={cn(
                                    "p-2 rounded-md shadow-sm border", // Added border back
                                    `text-[#012D5A]`, // Default text color
                                    selectedMode === mode.value
                                        ? `bg-[#012D5A] text-[#D47F00] foreground border-[#D47F00]`
                                        : `bg-[#F1F1F1] text-[#012D5A] hover:bg-gray-100 border-gray-300`
                                )}
                            >
                                <div className="flex flex-col items-center">
                                    <FontAwesomeIcon icon={mode.icon} className="text-xl mb-1" />
                                    <span className="text-xs">{mode.label}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

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


                {selectedHospital &&
                    <>
                        {/*<Separator className="mt-4 mb-4" />*/}

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

                {pathfindingResults &&
                    <>
                        <Separator className="mt-4 mb-4" />

                        <Label className="mb-4">
                            Text-to-speech
                            <Switch onCheckedChange={setTts} />
                        </Label>
                        {pathfindingResults.directions.map((step, i) => (
                            <div onClick={() => {
                                map?.setCurrentStepIdx(i, tts);
                            }}>{step.instructions} | {step.distance} | {step.time} | {step.icon}</div>
                        ))}

                        <div className="mb-5">
                            <div id="inner-step-instruction">Loading directions...</div>
                            <button
                                id="inner-next-step-btn"
                                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Next Step
                            </button>
                        </div>
                    </>
                }
            </div>
            <div ref={mapRef} className="flex-3">
                {/* Google map will go here */}
            </div>
        </div>
    );
}