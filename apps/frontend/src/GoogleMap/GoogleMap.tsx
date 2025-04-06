import React, { useEffect, useRef } from 'react';

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
                <input id="destination-input" type="text" placeholder="Destination" />
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

// --- Copy your AutocompleteDirectionsHandler class below this ---
class AutocompleteDirectionsHandler {
    map: google.maps.Map;
    originPlaceId: string;
    destinationPlaceId: string;
    travelMode: google.maps.TravelMode;
    directionsService: google.maps.DirectionsService;
    directionsRenderer: google.maps.DirectionsRenderer;

    constructor(map: google.maps.Map) {
        this.map = map;
        this.originPlaceId = '';
        this.destinationPlaceId = '';
        this.travelMode = google.maps.TravelMode.WALKING;
        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer();
        this.directionsRenderer.setMap(map);

        const originInput = document.getElementById('origin-input') as HTMLInputElement;
        const destinationInput = document.getElementById('destination-input') as HTMLInputElement;
        const modeSelector = document.getElementById('mode-selector') as HTMLSelectElement;

        const originAutocomplete = new google.maps.places.Autocomplete(originInput, {
            fields: ['place_id'],
        });

        const destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput, {
            fields: ['place_id'],
        });

        this.setupClickListener('changemode-walking', google.maps.TravelMode.WALKING);
        this.setupClickListener('changemode-transit', google.maps.TravelMode.TRANSIT);
        this.setupClickListener('changemode-driving', google.maps.TravelMode.DRIVING);

        this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
        this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(destinationInput);
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
    }

    setupClickListener(id: string, mode: google.maps.TravelMode) {
        const radioButton = document.getElementById(id) as HTMLInputElement;
        radioButton.addEventListener('click', () => {
            this.travelMode = mode;
            this.route();
        });
    }

    setupPlaceChangedListener(autocomplete: google.maps.places.Autocomplete, mode: string) {
        autocomplete.bindTo('bounds', this.map);
        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (!place.place_id) {
                window.alert('Please select an option from the dropdown list.');
                return;
            }

            if (mode === 'ORIG') {
                this.originPlaceId = place.place_id;
            } else {
                this.destinationPlaceId = place.place_id;
            }

            this.route();
        });
    }

    route() {
        if (!this.originPlaceId || !this.destinationPlaceId) return;

        this.directionsService.route(
            {
                origin: { placeId: this.originPlaceId },
                destination: { placeId: this.destinationPlaceId },
                travelMode: this.travelMode,
            },
            (response, status) => {
                if (status === 'OK') {
                    this.directionsRenderer.setDirections(response);
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            }
        );
    }
}




