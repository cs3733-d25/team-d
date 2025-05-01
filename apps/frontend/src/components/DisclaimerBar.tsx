import {faCircleExclamation, faX} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import React from "react";
import { useState } from "react";


const DisclaimerBar = () => {
    const [open, setOpen] = useState(true);
    return(
        open && (
        <div className="flex items-center justify-between py-1 bg-red-300 text-red-700">
            <div className="pl-5">
                <FontAwesomeIcon icon={faCircleExclamation} />
                 DISCLAIMER: This website is a term project exercise for WPI CS 3733
                Software Engineering (Prof. Wong) and is not to be confused with the actual Brigham &
                Women’s Hospital website.
            </div>
            <div className="flex justify-center px-5 hover:text-red-200">
                <button onClick={() => setOpen(false)}>
                    <FontAwesomeIcon icon={faX} />
                </button>
            </div>
        </div>
        )
    );
}

export default DisclaimerBar;