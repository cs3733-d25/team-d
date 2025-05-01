import React, { useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Polyline, Marker } from '@react-google-maps/api';
import { PathfindingResults } from '../types';

interface MapProps {
    center: google.maps.LatLngLiteral;
    zoom: number;
    path?: google.maps.LatLngLiteral[];
    startLocation?: google.maps.LatLngLiteral;
    endLocation?: google.maps.LatLngLiteral;
}

const Map: React.FC<MapProps> = ({ center, zoom, path, startLocation, endLocation }) => {
    const mapRef = useRef<google.maps.Map | null>(null);

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.panTo(center);
        }
    }, [center]);

    return (
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={center}
                zoom={zoom}
                onLoad={(map) => {
                    mapRef.current = map;
                }}
            >
                {path && (
                    <Polyline
                        path={path}
                        options={{
                            strokeColor: '#FF0000',
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                        }}
                    />
                )}
                {startLocation && (
                    <Marker
                        position={startLocation}
                        icon={{
                            url: '/images/start-marker.png',
                            scaledSize: new google.maps.Size(32, 32),
                        }}
                    />
                )}
                {endLocation && (
                    <Marker
                        position={endLocation}
                        icon={{
                            url: '/images/end-marker.png',
                            scaledSize: new google.maps.Size(32, 32),
                        }}
                    />
                )}
            </GoogleMap>
        </LoadScript>
    );
};

export default Map; 