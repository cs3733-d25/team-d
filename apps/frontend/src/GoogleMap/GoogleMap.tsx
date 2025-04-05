import React from 'react';
import {APIProvider, Map, ControlPosition, Marker} from '@vis.gl/react-google-maps';
// const  {REACT_APP_GOOGLE_MAPS_API_KEY} = process.env;

// let REACT_APP_GOOGLE_MAPS_API_KEY: string;
// ({ REACT_APP_GOOGLE_MAPS_API_KEY: REACT_APP_GOOGLE_MAPS_API_KEY } = process.env);

// let API_KEY: string = REACT_APP_GOOGLE_MAPS_API_KEY;
// const port: string = import.meta.env.FRONTEND_PORT;
// const API_KEY : string = import.meta.env.REACT_APP_GOOGLE_MAPS_API_KEY;

;
// let API_KEY: any = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
// // url      = env("POSTGRES_URL")

// console.log(API_KEY);
const GGMap = () => (
    <APIProvider apiKey={API_KEY}>
        <Map
            style={{ width: '100vw', height: '100vh' }}
            defaultCenter={{ lat: 22.54992, lng: 0 }}
            defaultZoom={3}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
        >
            <Marker position={{ lat: 53.54992, lng: 10.00678 }} />
        </Map>
        <p> hi just {API_KEY}</p>
        <script
            src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&callback=initMap&libraries=places&v=weekly"
            defer
        ></script>
    </APIProvider>
);

export default GGMap;