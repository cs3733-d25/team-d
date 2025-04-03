import React from 'react';
import { Outlet, Link } from "react-router-dom";

export default function Navbar()  {
    return (
        <div>
            <nav className="side-navbar">
                <ul className="nav-links">
                    <Link to={`/`}> Home </Link>
                    <Link to={`/emailinputpage`}> Login </Link>
                    <Link to={`/map`}> Map </Link>
                    <Link to={`/directory`}> Directory </Link>
                    <Link to={`/servicerequest`}> Service Request </Link>
                </ul>
            </nav>
            <Outlet />
        </div>

    );
};