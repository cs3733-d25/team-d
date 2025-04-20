import {useEffect, useRef, useState} from "react";
import {PathfindingMap} from "@/GMap/GoogleMap.ts";


export default function NewDirections() {

    const ref = useRef<HTMLDivElement>(null);
    const input = useRef<HTMLInputElement>(null);

    const [map, setMap] = useState<PathfindingMap>();

    useEffect(() => {
        const fetchMap = async () => {
            if (ref.current && input.current ) {
                setMap(await PathfindingMap.makeMap(ref.current, input.current));
            }
        }
        fetchMap();
    })

    return (
        <div className="flex flex-row flex-1">
            <div className="flex-1 p-4">
                <input ref={input} />
            </div>
            <div ref={ref} className="flex-3">

            </div>
        </div>
    )
}

declare global {
    interface Window {
        initMap: () => void;
        google: typeof google;
    }
}