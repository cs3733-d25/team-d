import React from 'react';
import { Outlet, Link } from "react-router-dom";

const Navbar = () => {
    return (
        <div>
            <nav className="side-navbar">
                <ul className="nav-links">
                    <Link to={`/`}> Home </Link>
                    <Link to={`/login`}> Login </Link>
                    <Link to={`/map`}> Map </Link>
                    <Link to={`/directory`}> Directory </Link>
                    <Link to={`/servicerequest`}> Service Request </Link>
                </ul>
            </nav>
            <Outlet />
        </div>

);
};

export default Navbar;