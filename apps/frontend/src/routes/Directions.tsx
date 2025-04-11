import GGMap from "@/GoogleMap/GoogleMap.tsx";
import {useRef} from 'react';
import {Input} from "@/components/ui/input.tsx";


export default function Directions() {
    const startInputRef = useRef<HTMLInputElement>(null);
    const locationDropdownRef = useRef<HTMLSelectElement>(null);

    return (
        <>
            <div className="flex-1 flex flex-row">
                <div className="flex-1">
                    <label htmlFor="start-input">Start Location</label>
                    <br/>
                    <input id="start-input" ref={startInputRef} type="text" />
                    <hr/>
                    <br/>
                    <label htmlFor="location-dropdown">Destination Hospital</label>
                    <br/>
                    <select id="location-dropdown" name="location-dropdown" ref={locationDropdownRef}>
                        <option value="Chestnut Hill">Chestnut Hill</option>
                        <option value="20 Patriot Place">20 Patriot Place</option>
                        <option value="22 Patriot Place">22 Patriot Place</option>
                    </select>
                    <hr/>
                    <br/>
                    <label htmlFor="department-dropdown">Start Location</label>
                    <br/>
                    <input id="department-dropdown" ref={startInputRef} type="text" />
                </div>
                <div className="flex-2">
                    <GGMap startInput={startInputRef} locationDropdown={locationDropdownRef} />
                </div>
            </div>
        </>
    )
}