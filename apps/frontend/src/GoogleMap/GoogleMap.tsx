import React, { useEffect, useRef, useState } from 'react';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

import AutocompleteDirectionsHandler from "@/GoogleMap/GoogleMapHelper.ts";
import floor_1_map from "@/public/rotated-solid.png";

// Declare window type extension
declare global {
    interface Window {
        initMap: () => void;
        google: typeof google;
    }
}

let historicalOverlay: google.maps.GroundOverlay | null = null;
let mapInstance: google.maps.Map | null = null;

const GGMap: React.FC = () => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const [overlayVisible, setOverlayVisible] = useState(true);

    const toggleOverlay = () => {
        if (historicalOverlay) {
            if (overlayVisible) {
                historicalOverlay.setMap(null);
            } else {
                historicalOverlay.setMap(mapInstance);
            }
            setOverlayVisible(!overlayVisible);
        }
    };

    const resetView = () => {
        if (mapInstance) {
            mapInstance.setZoom(20);
            mapInstance.setCenter({ lat: 42.32610824896946, lng: -71.14955534500426 });
        }
    };


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
                window.initMap?.();
            }
        };

        window.initMap = () => {
            if (!mapRef.current || !window.google) return;

            const map = new window.google.maps.Map(mapRef.current, {
                mapTypeControl: false,
                center: { lat: 42.32610824896946, lng: -71.14955534500426 },
                zoom: 20,
            });

            mapInstance = map;

            const imageBounds = {
                north: 42.32629629062394,
                south: 42.32566563128395,
                east: -71.14918542914931,
                west: -71.15015356316003,
            };

            historicalOverlay = new window.google.maps.GroundOverlay(
                floor_1_map,
                imageBounds
            );

            historicalOverlay.setMap(map);

            new AutocompleteDirectionsHandler(map);
        };

        loadScript(
            `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places,geometry,drawing&callback=initMap`
        );
    }, []);

    return (
        <div>
            <div style={{ display: 'flex', gap: '10px', padding: '10px' }}>
                <button
                    onClick={toggleOverlay}
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
                    {overlayVisible ? 'Hide Overlay' : 'Show Overlay'}
                </button>

                <button
                    onClick={resetView}
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
                    Reset Zoom
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

export default GGMap;
