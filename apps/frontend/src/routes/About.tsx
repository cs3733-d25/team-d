import React from "react";

import AliImg from "../public/team/Ali.jpg";
import ChristineImg from "../public/team/Christine.jpg";
import KeethuImg from "../public/team/Keethu.jpg";
import StuvatImg from "../public/team/Stuvat.jpg";
import JiamingImg from "../public/team/Jiaming.jpg";
import EmmaImg from "../public/team/Emma.jpg";
import JacobImg from "../public/team/Jacob.jpg";
import MaggieImg from "../public/team/Maggie.jpg";
import BrandonImg from "../public/team/Brandon.jpg";
import LucienImg from "../public/team/Lucien.jpg";
import DeliaImg from "../public/team/Delia.jpg";
import WongImg from "../public/team/Wong.jpg";
import KatyImg from "../public/team/Katy.jpg";

//for the 1000th Commit
type Person = {
    name: string;
    position: string;
    photo?: string;
};

const faculty: Person[] = [
    { name: "Prof. Wilson Wong", position: "Course Instructor", photo: WongImg },
    { name: "Katy Stuparu",      position: "Team Coach", photo: KatyImg },
];

const members: Person[] = [
    // Co-Leads
    { name: "Jacob Boyle", position: "Co-Lead", photo: JacobImg },
    { name: "Thanh Ho",    position: "Co-Lead", photo: EmmaImg },

    // Assistant Leads
    { name: "Margareth Hosie",       position: "Assistant Lead for Back-End", photo: MaggieImg },
    { name: "Keerthana Jayamoorthy", position: "Assistant Lead for Front-End", photo: KeethuImg },

    // Team
    {
        name:     "Stuvat Dash",
        position: "Front-End & Feature Software Engineer",
        photo:    StuvatImg,
    },
    { name: "Brandon Small",  position: "Front-End & Feature Engineer • Scrum Master", photo: BrandonImg },
    { name: "Delia Jasper",   position: "Front-End & Feature Engineer", photo: DeliaImg },
    { name: "Lucien La Rock", position: "Front-End & Feature Engineer • Project Manager", photo: LucienImg },
    { name: "Christine Ngo",  position: "Back-End Database Engineer & Product Owner", photo: ChristineImg },
    { name: "Ali Riad",       position: "Algorithms & Feature Engineer", photo: AliImg },
    { name: "Jiaming Du",     position: "Algorithms & Feature Engineer", photo: JiamingImg },
];

/*  Card component */
const Card: React.FC<Person> = ({ name, position, photo }) => (
    <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition">
        {photo ? (
            <img
                src={photo}
                alt={name}
                className="w-24 h-24 rounded-full object-cover mb-3 shrink-0"
            />
        ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 mb-3 shrink-0" />
        )}

        <h3 className="text-lg font-semibold text-center">{name}</h3>
        <p className="text-sm text-gray-600 text-center">{position}</p>
    </div>
);

/*  Page component */
const About: React.FC = () => (
    <main className="min-h-screen bg-slate-50 py-10 px-4 flex flex-col items-center">
        {/* Header */}
        <section className="max-w-5xl w-full text-center mb-10 space-y-1">
            <h1 className="text-3xl font-bold text-blue-900">About This Project</h1>
            <p>WPI Computer Science Department • CS3733-D25 Software Engineering</p>
            <p>
                Thank you to Brigham&nbsp;&amp;&nbsp;Women’s Hospital and their
                representative, <span className="font-medium">Andrew Shinn</span>.
            </p>
        </section>

        {/* Faculty */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl w-full mb-12">
            {faculty.map((p) => (
                <Card key={p.name} {...p} />
            ))}
        </section>

        {/* Team-member grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
            {members.map((p) => (
                <Card key={p.name} {...p} />
            ))}
        </section>

        {/* Footer */}
        <footer className="max-w-4xl w-full mt-12 text-center text-sm text-gray-600">
            The Brigham&nbsp;&amp;&nbsp;Women’s Hospital maps and data used in this
            application are copyrighted and provided solely for educational
            purposes.
        </footer>
    </main>
);

export default About;
