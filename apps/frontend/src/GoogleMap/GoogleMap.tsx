import React, {RefObject, useEffect, useRef, useState} from 'react';
import GoogleMap from "@/GoogleMap/GoogleMap.ts";
import {Hospital, Floor, Department} from '@/routes/Directions.tsx'

const API_KEY: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;



export interface GoogleMapProps {
    autoCompleteRef: RefObject<HTMLInputElement | null>;
    hospital: Hospital | undefined;
    floor: Floor | undefined;
    department: Department | undefined;
}



const GGMap = (props: GoogleMapProps) => {
    const mapRef = useRef<HTMLDivElement | null>(null);

    const [map, setMap] = React.useState<GoogleMap | undefined>();


    // Used to load the script that google maps API uses
    useEffect(() => {
        const loadScript = (url: string) => {
            const existingScript = document.querySelector(`script[src="${url}"]`);
            if (!existingScript) {
                const script = document.createElement('script');
                script.src = url;
                script.async = true;
                script.defer = true;
                script.onload = () => window.initMap?.();
                document.body.appendChild(script);
            } else {
                // Already loaded
                window.initMap?.();
            }
        };

        // Attach initMap to window for Google callback
        window.initMap = () => {
            if (!mapRef.current || !props.autoCompleteRef.current || !window.google) return;

            setMap(new GoogleMap(mapRef.current, props));

        };

        // Load Google Maps JS API with Places library
        loadScript(
            `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=initMap`
        );
    }, []);

    // Update the map when new hospital/dept selected
    useEffect(() => {
        console.log('UseEffect');
        if (!map) return;
        map.update(props);
    }, [props.department, props.floor, props.hospital]);

    return (
        <div>
            <div
                id="ggl-map"
                ref={mapRef}
                style={{ width: '65vw', height: '100vh' }}
            ></div>
        </div>
    );
};

declare global {
    interface Window {
        initMap: () => void;
        google: typeof google;
    }
}

export default GGMap;






