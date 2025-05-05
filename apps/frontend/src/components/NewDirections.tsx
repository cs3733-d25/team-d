// import React, { useState, useEffect, useRef } from 'react';
// import FloorSelector from './FloorSelector';
// import Map from './Map';
// import { PathfindingResults } from '../types';
//
// export default function NewDirections({ pathfindingResults }: { pathfindingResults: PathfindingResults }) {
//     const [currentFloor, setCurrentFloor] = useState<number>(pathfindingResults.floors[0]);
//     const [currentStep, setCurrentStep] = useState<number>(0);
//     const [showMap, setShowMap] = useState<boolean>(false);
//     const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral | null>(null);
//     const mapRef = useRef<any>(null);
//
//     useEffect(() => {
//         if (pathfindingResults.startLocation) {
//             setMapCenter(pathfindingResults.startLocation);
//         }
//     }, [pathfindingResults.startLocation]);
//
//     const handleStepClick = (index: number) => {
//         setCurrentStep(index);
//         mapRef.current?.setCurrentStepIdx(index, false);
//     };
//
//     const handleFloorChange = (floor: number) => {
//         setCurrentFloor(floor);
//     };
//
//     return (
//         <div className="flex flex-col h-full">
//             <div className="flex-1 overflow-y-auto p-4">
//                 <div className="mb-4">
//                     <FloorSelector
//                         floors={pathfindingResults.floors}
//                         currentFloor={currentFloor}
//                         onFloorChange={handleFloorChange}
//                     />
//                 </div>
//                 <div className="space-y-2">
//                     {pathfindingResults.directions.map((step, index) => (
//                         <div
//                             key={index}
//                             className={`p-3 rounded-lg cursor-pointer ${
//                                 currentStep === index ? 'bg-blue-100' : 'bg-gray-50'
//                             }`}
//                             onClick={() => handleStepClick(index)}
//                         >
//                             <p className="text-sm">{step.instructions}</p>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//             {showMap && mapCenter && (
//                 <div className="h-64">
//                     <Map
//                         ref={mapRef}
//                         center={mapCenter}
//                         zoom={18}
//                         path={pathfindingResults.path}
//                         startLocation={pathfindingResults.startLocation}
//                         endLocation={pathfindingResults.endLocation}
//                     />
//                 </div>
//             )}
//             <div className="p-4 border-t">
//                 <button
//                     className="w-full bg-blue-500 text-white py-2 rounded-lg"
//                     onClick={() => setShowMap(!showMap)}
//                 >
//                     {showMap ? 'Hide Map' : 'Show Map'}
//                 </button>
//             </div>
//         </div>
//     );
// }