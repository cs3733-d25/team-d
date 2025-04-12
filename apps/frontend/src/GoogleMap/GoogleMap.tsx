import React, {RefObject, useEffect, useRef, useState} from 'react';
import GoogleMap from "@/GoogleMap/GoogleMap.ts";
import {Hospital, Department} from '@/routes/Directions.tsx'

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// const DESTINATION_PLACE_IDS = {
//     CHESTNUT_HILL:    'ChIJLwkLvP5444kRGTnWxi0zsnM',
//     PATRIOT_PLACE_20: 'ChIJHzla42V95IkR_bz0ni4NvfI',
//     PATRIOT_PLACE_22: 'ChIJKQrcBrd85IkRhhpDZMarvhQ',
// }

// const PLACES = [
//     {
//         name: 'Chestnut Hill',
//         id: 'ChIJLwkLvP5444kRGTnWxi0zsnM',
//     },
//     {
//         name: '20 Patriot Place',
//         id: 'ChIJHzla42V95IkR_bz0ni4NvfI',
//     },
//     {
//         name: '22 Patriot Place',
//         id: 'ChIJKQrcBrd85IkRhhpDZMarvhQ',
//     },
// ];

import AutocompleteDirectionsHandler from "@/GoogleMap/GoogleMapHelper.ts";
import floor_1_map from "@/public/rotated-solid.png";
import FloorMap from "@/GoogleMap/FloorMap.ts";
//
// Declare window type extension


export interface GoogleMapProps {
    autoCompleteRef: RefObject<HTMLInputElement | null>;
    hospital: Hospital | undefined;
    department: Department | undefined;
}



const GGMap = (props: GoogleMapProps) => {
    const mapRef = useRef<HTMLDivElement | null>(null);

    // const [destinationPlaceId, setDestinationPlaceId] = React.useState<string>(DESTINATION_PLACE_IDS.CHESTNUT_HILL);
    const [map, setMap] = React.useState<GoogleMap | undefined>();


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

    useEffect(() => {
        if (!map || !props.hospital) return;
        // for (const place of PLACES) {
        //     if (place.name == props.hospital) {
        //         console.log(place);
        //         map.updateDestinationPlaceId(place.id);
        //         break;
        //     }
        // }
        map.updateDestinationPlaceId(props.hospital.placeId);
        // switch (props.hospital) {
        //     case 'Chestnut Hill':
        //         console.log('Chestnut Hill');
        //         setDestinationPlaceId(DESTINATION_PLACE_IDS.CHESTNUT_HILL);
        //         console.log(destinationPlaceId);
        //         break;
        //     case '20 Patriot Place':
        //         console.log('20 Patriot Place');
        //         setDestinationPlaceId(DESTINATION_PLACE_IDS.PATRIOT_PLACE_20);
        //         console.log(destinationPlaceId);
        //         break;
        //     case '22 Patriot Place':
        //         console.log('22 Patriot Place');
        //         setDestinationPlaceId(DESTINATION_PLACE_IDS.PATRIOT_PLACE_22);
        //         break;
        //     default:
        //         console.error('Unknown location dropdown.');
        //         break;
        // }
    }, [props.hospital]);

    return (
        <div>
            <div style={{ display: 'flex', gap: '10px', padding: '10px' }}>
                <button
                    // onClick={toggleOverlay}
                    style={{
                        zIndex: 1000,
                        padding: '8px 12px',
                        borderRadius: '4px',
                        backgroundColor: '#007BFF',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                >
                    {/*{overlayVisible ? 'Hide Overlay' : 'Show Overlay'}*/}
                </button>

                <button
                    // onClick={resetView}
                    style={{
                        zIndex: 1000,
                        padding: '8px 12px',
                        borderRadius: '4px',
                        backgroundColor: '#28a745',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                >
                    Reset View
                </button>
            </div>

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






