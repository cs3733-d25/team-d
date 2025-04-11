import React, { useEffect, useRef } from 'react';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

import AutocompleteDirectionsHandler from "@/GoogleMap/GoogleMapHelper.ts";
// import USGSOverlay from "@/GoogleMap/GoogleMapOverlay.ts";

import floor_1_map from "@/public/floor1transparent.png";

// Declare window type extension
declare global {
    interface Window {
        initMap: () => void;
        google: typeof google;
    }
}


let historicalOverlay;

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
                center: { lat: 42.32610824896946, lng: -71.14955534500426},
                zoom: 23,
            });

            const flightPlanCoordinates = [
                { lat: 37.772, lng: -122.214 },
                { lat: 21.291, lng: -157.821 },
                { lat: -18.142, lng: 178.431 },
                { lat: -27.467, lng: 153.027 },
            ];
            const flightPath = new google.maps.Polyline({
                path: flightPlanCoordinates,
                geodesic: true,
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 2,
            });

            const imageBounds = {
                north: 42.32629501962394,
                south: 42.32567963129395,
                east: -71.14924542914931,
                west: -71.15010356316003,
            };

            historicalOverlay = new google.maps.GroundOverlay(
                floor_1_map,
                imageBounds
            );

            new AutocompleteDirectionsHandler(map);
            console.log('hi');
            historicalOverlay.setMap(map);
            flightPath.setMap(map);

        };

        // Load Google Maps JS API with Places library
        loadScript(
            `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=initMap`
        );
    }, []);

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
            </div>

            <div
                id="ggl-map"
                ref={mapRef}
                style={{ width: '65vw', height: '100vh' }}
            ></div>
        </div>
    );
};

export default GGMap;





