import React, { useEffect, useRef } from 'react';

const API_KEY = '';

import AutocompleteDirectionsHandler from "@/GoogleMap/GoogleMapHelper.ts";

const GGMap: React.FC = () => {
    const mapRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const loadScript = (url: string) => {
            const existingScript = document.querySelector(`script[src="${url}"]`);
            if (!existingScript) {
                const script = document.createElement('script');
                script.src = url;
                script.async = true;
                script.defer = true;
                script.onload = () => {
                    // After script loads, initialize map
                    window.initMap?.();
                };
                document.body.appendChild(script);
            } else {
                // Already loaded
                window.initMap?.();
            }
        };

        // Attach initMap to window for Google callback
        window.initMap = () => {
            if (!mapRef.current || !window.google) return;

            const map = new window.google.maps.Map(mapRef.current, {
                mapTypeControl: false,
                center: { lat: -33.8688, lng: 151.2195 },
                zoom: 13,
            });

            new AutocompleteDirectionsHandler(map);
        };

        // Load Google Maps JS API with Places library
        loadScript(
            `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=initMap`
        );
    }, []);

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <input id="origin-input" type="text" placeholder="Origin" />
                {/*<input id="destination-input" type="text" placeholder="Destination" />*/}
                <select id="destination-selector">
                    <option value="entrance" id="entrance">Entrance</option>
                    <option value="desk" id="desk">Desk</option>
                    <option value="parking" id="parking">Parking</option>
                </select>

                <select id="mode-selector">
                    <option value="WALKING" id="changemode-walking">Walking</option>
                    <option value="TRANSIT" id="changemode-transit">Transit</option>
                    <option value="DRIVING" id="changemode-driving">Driving</option>
                </select>
            </div>
            <div
                id="map"
                ref={mapRef}
                style={{ width: '100vw', height: '100vh' }}
            ></div>
        </div>
    );
};

export default GGMap;

// Declare window type extension
declare global {
    interface Window {
        initMap: () => void;
        google: typeof google;
    }
}





