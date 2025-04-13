import React from 'react';
import { Outlet, Link } from "react-router-dom";
import Banner from "@/components/Banner";
import hospitalLogo from "@/public/hospital2.png";

export default function Footer() {
    return (
        <>
        <footer className="bg-gray-900 text-gray-200">
            <div className="container mx-auto py-14 px-6">
                <div className="grid md:grid-cols-12 grid-cols-1 gap-7">
                    <div className="lg:col-span-4 col-span-12">
                        <a href="/">
                            <img
                                className="h-12"
                                src="/src/styles/brigham_logo.png"
                                alt=""
                            />
                        </a>
                        <p className="mt-6">
                            FOOTER
                        </p>
                    </div>
                    <div className="lg::col-span-2 md:col-span-4 col-span-12">
                        <h5 className="tracking-wide text-gray-100 font-semibold"> Company</h5>
                        <ul className="list-none mt-6 space-y-2">
                            <li>
                                <a
                                    href="#"
                                    className=" hover:text-gray-400 transition-all duration-500 ease-in-out"
                                >
                                    About us </a
                                >
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className=" hover:text-gray-400 transition-all duration-500 ease-in-out"
                                >
                                    Serivces </a
                                >
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className=" hover:text-gray-400 transition-all duration-500 ease-in-out"
                                >
                                    Articles </a
                                >
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    </>
    );
}