import React, {RefObject, useEffect, useRef} from 'react';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const DESTINATION_PLACE_IDS = {
    CHESTNUT_HILL:    'ChIJLwkLvP5444kRGTnWxi0zsnM',
    PATRIOT_PLACE_20: 'ChIJHzla42V95IkR_bz0ni4NvfI'
}

import AutocompleteDirectionsHandler from "@/GoogleMap/GoogleMapHelper.ts";

interface Props {
    startInput: RefObject<HTMLInputElement | null>;
    locationDropdown: RefObject<HTMLSelectElement | null>;
}

const GGMap = (props: Props) => {
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
            if (!mapRef.current || !window.google || !props.startInput.current || !props.locationDropdown.current) return;

            let originPlaceId = '';
            let destinationPlaceId = DESTINATION_PLACE_IDS.CHESTNUT_HILL;

            const map = new window.google.maps.Map(mapRef.current, {
                mapTypeControl: false,
                center: { lat: 42.32629334182415, lng: -71.14949465487962},
                zoom: 19,
            });

            const line = new window.google.maps.Polyline({
                path: [
                    { lat: 42.32629334182415, lng: -71.14949465487962},
                    { lat: 42.32620824896946, lng: -71.14965534500426},
                ],
                geodesic: true,
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 2,
                map: map,
            });

            const directionsService = new google.maps.DirectionsService();
            const directionsRenderer = new google.maps.DirectionsRenderer();
            directionsRenderer.setMap(map);

            const originAutocomplete = new google.maps.places.Autocomplete(props.startInput.current, {
                fields: ['place_id'],
            });

            originAutocomplete.bindTo('bounds', map);
            originAutocomplete.addListener('place_changed', async () => {
                const placeId = originAutocomplete.getPlace().place_id;
                if (!placeId) {
                    window.alert('Please select an option from the dropdown list.');
                    return;
                }
                else {
                    originPlaceId = placeId;
                    await route();
                }

            });

            props.locationDropdown.current.addEventListener('change', async () => {
                // @ts-expect-error
                switch (props.locationDropdown.current.value) {
                    case 'Chestnut Hill':
                        destinationPlaceId = DESTINATION_PLACE_IDS.CHESTNUT_HILL;
                        await route();
                        break;
                    case '20 Patriot Place':
                        destinationPlaceId = DESTINATION_PLACE_IDS.PATRIOT_PLACE_20;
                        await route();
                        break;
                    default:
                        destinationPlaceId = DESTINATION_PLACE_IDS.CHESTNUT_HILL;
                        await route();
                        break;

                }
            });

            const route = async () => {
                if (!originPlaceId || !destinationPlaceId) return;
                console.log('Routing!');
                await directionsService.route(
                    {
                        origin: {placeId: originPlaceId},
                        destination: {placeId: destinationPlaceId},
                        travelMode: google.maps.TravelMode.DRIVING,
                    },
                    (response, status) => {
                        if (status === 'OK') {
                            directionsRenderer.setDirections(response);
                        } else {
                            window.alert('Directions request failed due to ' + status);
                        }
                    }
                );
            }

            // new AutocompleteDirectionsHandler(map);
        };

        // Load Google Maps JS API with Places library
        loadScript(
            `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=initMap`
        );
    }, []);

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {/*<input id="origin-input" type="text" placeholder="Origin" />*/}
                {/*<input id="destination-input" type="text" placeholder="Destination" />*/}

                {/*This currently is not working because we have yet to implement the path to any of the option*/}


                {/*<select id="mode-selector">*/}
                {/*    <option value="WALKING" id="changemode-walking">*/}
                {/*        Walking*/}
                {/*    </option>*/}
                {/*    <option value="TRANSIT" id="changemode-transit">*/}
                {/*        Transit*/}
                {/*    </option>*/}
                {/*    <option value="DRIVING" id="changemode-driving">*/}
                {/*        Driving*/}
                {/*    </option>*/}
                {/*</select>*/}
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

// Declare window type extension
declare global {
    interface Window {
        initMap: () => void;
        google: typeof google;
    }
}





