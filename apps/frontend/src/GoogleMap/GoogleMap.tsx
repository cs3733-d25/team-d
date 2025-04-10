import React, { useEffect, useRef } from 'react';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

import AutocompleteDirectionsHandler from "@/GoogleMap/GoogleMapHelper.ts";
// import USGSOverlay from "@/GoogleMap/GoogleMapOverlay.ts";

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

            class USGSOverlay extends google.maps.OverlayView {
                private bounds: google.maps.LatLngBounds;
                private image: string;
                private div?: HTMLElement;

                constructor(bounds: google.maps.LatLngBounds, image: string) {
                    super();

                    this.bounds = bounds;
                    this.image = image;
                }

                /**
                 * onAdd is called when the map's panes are ready and the overlay has been
                 * added to the map.
                 */
                onAdd() {
                    this.div = document.createElement("div");
                    this.div.style.borderStyle = "none";
                    this.div.style.borderWidth = "0px";
                    this.div.style.position = "absolute";

                    // Create the img element and attach it to the div.
                    const img = document.createElement("img");

                    img.src = this.image;
                    img.style.width = "100%";
                    img.style.height = "100%";
                    img.style.position = "absolute";
                    this.div.appendChild(img);

                    // Add the element to the "overlayLayer" pane.
                    const panes = this.getPanes()!;

                    panes.overlayLayer.appendChild(this.div);
                }

                draw() {
                    // We use the south-west and north-east
                    // coordinates of the overlay to peg it to the correct position and size.
                    // To do this, we need to retrieve the projection from the overlay.
                    const overlayProjection = this.getProjection();

                    // Retrieve the south-west and north-east coordinates of this overlay
                    // in LatLngs and convert them to pixel coordinates.
                    // We'll use these coordinates to resize the div.
                    const sw = overlayProjection.fromLatLngToDivPixel(
                        this.bounds.getSouthWest()
                    )!;
                    const ne = overlayProjection.fromLatLngToDivPixel(
                        this.bounds.getNorthEast()
                    )!;

                    // Resize the image's div to fit the indicated dimensions.
                    if (this.div) {
                        this.div.style.left = sw.x + "px";
                        this.div.style.top = ne.y + "px";
                        this.div.style.width = ne.x - sw.x + "px";
                        this.div.style.height = sw.y - ne.y + "px";
                    }
                }

                /**
                 * The onRemove() method will be called automatically from the API if
                 * we ever set the overlay's map property to 'null'.
                 */
                onRemove() {
                    if (this.div) {
                        (this.div.parentNode as HTMLElement).removeChild(this.div);
                        delete this.div;
                    }
                }

                /**
                 *  Set the visibility to 'hidden' or 'visible'.
                 */
                hide() {
                    if (this.div) {
                        this.div.style.visibility = "hidden";
                    }
                }

                show() {
                    if (this.div) {
                        this.div.style.visibility = "visible";
                    }
                }

                toggle() {
                    if (this.div) {
                        if (this.div.style.visibility === "hidden") {
                            this.show();
                        } else {
                            this.hide();
                        }
                    }
                }

                toggleDOM(map: google.maps.Map) {
                    if (this.getMap()) {
                        this.setMap(null);
                    } else {
                        this.setMap(map);
                    }
                }
            }

            if (!mapRef.current || !window.google) return;

            const bounds = new google.maps.LatLngBounds(
                new google.maps.LatLng(62.281819, -150.287132),
                new google.maps.LatLng(62.400471, -150.005608)
            );

            // The photograph is courtesy of the U.S. Geological Survey.
            let image = "https://developers.google.com/maps/documentation/javascript/";

            image += "examples/full/images/talkeetna.png";

            const map = new window.google.maps.Map(mapRef.current, {
                mapTypeControl: false,
                center: { lat: 42.32610824896946, lng: -71.14955534500426},
                zoom: 19,
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

            const overlay: USGSOverlay = new USGSOverlay(bounds, image);


            const toggleButton = document.createElement("button");

            toggleButton.textContent = "Toggle";
            toggleButton.classList.add("custom-map-control-button");

            const toggleDOMButton = document.createElement("button");

            toggleDOMButton.textContent = "Toggle DOM Attachment";
            toggleDOMButton.classList.add("custom-map-control-button");

            toggleButton.addEventListener("click", () => {
                overlay.toggle();
            });

            toggleDOMButton.addEventListener("click", () => {
                overlay.toggleDOM(map);
            });

            map.controls[google.maps.ControlPosition.TOP_RIGHT].push(toggleDOMButton);
            map.controls[google.maps.ControlPosition.TOP_RIGHT].push(toggleButton);

            new AutocompleteDirectionsHandler(map);
            overlay.setMap(map);
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





