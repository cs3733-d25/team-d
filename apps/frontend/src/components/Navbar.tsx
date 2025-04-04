import React, { useState } from 'react';
import { Outlet, Link, useLocation } from "react-router-dom";
import logo from '../styles/brigham_logo.png';

export default function Navbar() {
    const location = useLocation();
    const [hoveredLink, setHoveredLink] = useState<string | null>(null);

    const isActive = (path: string) => location.pathname === path ? 'active' : '';

    const navbarStyle: React.CSSProperties = {
        backgroundColor: '#003A63',
        color: 'white',
        width: '100%',
        padding: '10px 20px',
        position: 'fixed',
        top: '0',
        left: '0',
        zIndex: '1000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    };

    const navLinksStyle: React.CSSProperties = {
        listStyleType: 'none',
        display: 'flex',
        justifyContent: 'center',
        padding: '0',
    };

    const linkStyle: React.CSSProperties = {
        textDecoration: 'none',
        color: 'white',
        fontSize: '16px',
        display: 'inline-block',
        margin: '0 20px',
        padding: '10px 20px',
        backgroundColor: '#005B7F',
        borderRadius: '5px',
        border: '1px solid #003A63',
        transition: 'background-color 0.3s ease',
    };

    const activeLinkStyle: React.CSSProperties = {
        fontWeight: 'bold',
        color: '#FFB81C',
    };

    const hoverLinkStyle: React.CSSProperties = {
        color: '#00B0A4',
        backgroundColor: '#00729B',
    };

    return (
        <div>
            <nav style={navbarStyle}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                        src={logo}
                        alt="Logo"
                        style={{
                            width: '350px',
                            height: 'auto',
                            marginRight: '20px',
                        }}
                    />
                </div>
                <ul style={navLinksStyle}>
                    <li>
                        <Link
                            to={`/`}
                            style={{
                                ...linkStyle,
                                ...(isActive('/') ? activeLinkStyle : {}),
                                ...(hoveredLink === '/' ? hoverLinkStyle : {}),
                            }}
                            onMouseEnter={() => setHoveredLink('/')}
                            onMouseLeave={() => setHoveredLink(null)}
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            to={`/emailinputpage`}
                            style={{
                                ...linkStyle,
                                ...(isActive('/emailinputpage') ? activeLinkStyle : {}),
                                ...(hoveredLink === '/emailinputpage' ? hoverLinkStyle : {}),
                            }}
                            onMouseEnter={() => setHoveredLink('/emailinputpage')}
                            onMouseLeave={() => setHoveredLink(null)}
                        >
                            Login
                        </Link>
                    </li>
                    <li>
                        <Link
                            to={`/map`}
                            style={{
                                ...linkStyle,
                                ...(isActive('/map') ? activeLinkStyle : {}),
                                ...(hoveredLink === '/map' ? hoverLinkStyle : {}),
                            }}
                            onMouseEnter={() => setHoveredLink('/map')}
                            onMouseLeave={() => setHoveredLink(null)}
                        >
                            Map
                        </Link>
                    </li>
                    <li>
                        <Link
                            to={`/directory`}
                            style={{
                                ...linkStyle,
                                ...(isActive('/directory') ? activeLinkStyle : {}),
                                ...(hoveredLink === '/directory' ? hoverLinkStyle : {}),
                            }}
                            onMouseEnter={() => setHoveredLink('/directory')}
                            onMouseLeave={() => setHoveredLink(null)}
                        >
                            Directory
                        </Link>
                    </li>
                    <li>
                        <Link
                            to={`/servicerequest`}
                            style={{
                                ...linkStyle,
                                ...(isActive('/servicerequest') ? activeLinkStyle : {}),
                                ...(hoveredLink === '/servicerequest' ? hoverLinkStyle : {}),
                            }}
                            onMouseEnter={() => setHoveredLink('/servicerequest')}
                            onMouseLeave={() => setHoveredLink(null)}
                        >
                            Service Request
                        </Link>
                    </li>
                </ul>
            </nav>
            <Outlet />
        </div>
    );
}
