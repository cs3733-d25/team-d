import {GoogleMapProps} from "@/GoogleMap/GoogleMap.tsx";

export default class GoogleMap {

    private readonly map: google.maps.Map;
    private readonly directionsService: google.maps.DirectionsService;
    private readonly directionsRenderer: google.maps.DirectionsRenderer;
    private readonly autocomplete: google.maps.places.Autocomplete;

    private startPlaceId: string;
    private destinationPlaceId: string;

    constructor(mapRef: HTMLDivElement, props: GoogleMapProps) {
        if (!mapRef || !props.autoCompleteRef.current) throw new Error('Missing References');

        this.map = new google.maps.Map(mapRef, {
            mapTypeControl: false,
            center: {lat: 42.32610824896946, lng: -71.14955534500426},
            zoom: 20,
        });

        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer({
            map: this.map
        });
        this.autocomplete = new google.maps.places.Autocomplete(props.autoCompleteRef.current, {
            fields: ['place_id'],
        });
        this.autocomplete.addListener('place_changed', () => {
            const placeId = this.autocomplete.getPlace().place_id;
            if (!placeId) {
                window.alert('Please select an option from the dropdown list.');
                return;
            } else {
                this.startPlaceId = placeId;
                console.log('Start is now ' + this.startPlaceId);
                this.route();
            }
        });
        this.startPlaceId = '';
        this.destinationPlaceId = '';
    }

    route(): void {
        if (!this.startPlaceId || !this.destinationPlaceId) {
            console.log('Insufficient fields')
            return;
        }
        console.log('Routing ' + this.startPlaceId + ' to ' + this.destinationPlaceId);
        this.directionsService.route(
            {
                origin: {placeId: this.startPlaceId},
                destination: {placeId: this.destinationPlaceId},
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (response, status) => {
                if (status === 'OK') {
                    console.log('Routed!');
                    this.directionsRenderer.setDirections(response);
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            }
        );
    }

    updateDestinationPlaceId(destinationPlaceId: string) {
        this.destinationPlaceId = destinationPlaceId;
        console.log('Destination is now ' + this.destinationPlaceId);
        this.route();
    }
}