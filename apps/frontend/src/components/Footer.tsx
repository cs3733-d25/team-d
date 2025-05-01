import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFacebook, faInstagram, faLinkedin, faSquareXTwitter, faYoutube} from "@fortawesome/free-brands-svg-icons";
import {NavigationMenuItem, NavigationMenuLink} from "@/components/ui/navigation-menu.tsx";
import {Link} from "react-router-dom";

//
// Use for comments
{/**/}
export default function Footer() {
    return (
        <>
            <footer className="bg-blue-900 text-gray-200">
                <div className="container mx-auto py-5">
                    <div className="flex flex-row justify-evenly">
                        <div className="flex flex-col gap-4">
                            <p className="mb-0">&copy; 2025 Brigham and Women's Hospital</p>
                            <p>75 Francis Street, Boston MA 02115</p>
                        </div>
                        {/*Company*/}
                        <div className="lg:col-span-2 md:col-span-4 col-span-12">
                            <h5 className="tracking-wide text-gray-100 font-semibold">Company</h5>
                            <ul className="list-none py-1 space-y-1">
                                <li>
                                    <a
                                        href="/about"
                                        className=" hover:text-gray-400 transition-all duration-500 ease-in-out"
                                    >
                                        About us{' '}
                                    </a>
                                </li>
                                <li>
                                    <Link to="/citations">Citations</Link>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className=" hover:text-gray-400 transition-all duration-500 ease-in-out"
                                    >
                                        Articles{' '}
                                    </a>
                                </li>
                            </ul>
                        </div>
                        {/*Important Links*/}
                        <div className="lg:col-span-3 md:col-span-4 col-span-12">
                            <h5 className="tracking-wide text-gray-100 font-semibold">
                                Important Links
                            </h5>
                            <ul className="list-none py-1 space-y-1">
                                <li>
                                    <a
                                        href="#"
                                        className=" hover:text-gray-400 transition-all duration-500 ease-in-out"
                                    >
                                        Terms of Service{' '}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className=" hover:text-gray-400 transition-all duration-500 ease-in-out"
                                    >
                                        Privacy Policy{' '}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className=" hover:text-gray-400 transition-all duration-500 ease-in-out"
                                    >
                                        Help{' '}
                                    </a>
                                </li>
                            </ul>
                        </div>
                        {/*Contacts*/}
                        <div>
                            <h5 className="tracking-wide text-gray-100 font-semibold">
                                Connect and Contact Us
                            </h5>
                            <ul className="list-none py-1 space-y-1">
                                <li>General Information: 617-732-5500</li>
                                <li>New Patients: 800-294-9999</li>
                            </ul>

                            {/*Social Media Links*/}
                            <div className="flex flex-row gap-6">
                                <a href="https://x.com/BrighamWomens"
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   aria-label="X"
                                >
                                    <FontAwesomeIcon icon={faSquareXTwitter} />
                                </a>

                                <a
                                    href="https://www.instagram.com/accounts/login/?next=https%3A%2F%2Fwww.instagram.com%2Fbrighamandwomens%2F%3Fhl%3Den&is_from_rle"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                >
                                    &nbsp;&nbsp;<FontAwesomeIcon icon={faInstagram} className="size-5"/>
                                </a>

                                <a href="https://www.facebook.com/BrighamandWomensHospital/#"
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   aria-label="Facebook">
                                    &nbsp;&nbsp;<FontAwesomeIcon icon={faFacebook} />
                                </a>

                                <a href="https://www.youtube.com/user/Brighamandwomens"
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   aria-label="Youtube">
                                    &nbsp;&nbsp;<FontAwesomeIcon icon={faYoutube} />
                                </a>
                                <a
                                    href="https://www.linkedin.com/company/brigham-and-women%27s-hospital/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="LinkedIn">
                                    &nbsp;&nbsp;<FontAwesomeIcon icon={faLinkedin} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}