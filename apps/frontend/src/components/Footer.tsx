import React from 'react';


// Use for comments
{/**/}
export default function Footer() {
    return (
        <>
        <footer className="bg-gray-900 text-gray-200">
            <div className="container mx-auto py-5">
                <div className="flex flex-row justify-evenly">
                    {/*Company*/}
                    <div className="lg:col-span-2 md:col-span-4 col-span-12">
                        <h5 className="tracking-wide text-gray-100 font-semibold">
                            Company
                        </h5>
                        <ul className="list-none py-1 space-y-1">
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
                                    Services </a
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
                                        Terms of Service </a
                                    >
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className=" hover:text-gray-400 transition-all duration-500 ease-in-out"
                                    >
                                        Privacy Policy </a
                                    >
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className=" hover:text-gray-400 transition-all duration-500 ease-in-out"
                                    >
                                        Help </a
                                    >
                                </li>
                            </ul>

                        </div>
                    {/*Newsletter*/}
                    <div>
                        <h5 className="tracking-wide text-gray-100 font-semibold">
                            Contact Us
                        </h5>
                        <ul className="list-none py-1 space-y-1">
                            <li>
                                General Information: <span className="text-blue-300">617-732-5500</span>
                            </li>
                            <li>
                                New Patients: <span className="text-blue-300">800-294-9999</span>
                            </li>
                        </ul>
                </div>
            </div>
        </div>
            <div className="border-t border-slate-700">
                <div className="md:text-left text-center container mx-auto py-2 px-6">
                    <p className="mb-0">
                        &copy;
                        2025
                        Brigham and Women's Hospital
                    </p>
                </div>
            </div>
        </footer>
</>
)
    ;
}