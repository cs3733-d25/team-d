import React from "react";
import { useState } from "react";

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
    quote: string;
};

const faculty: Person[] = [
    { name: "Prof. Wilson Wong", position: "Course Instructor", photo: WongImg, quote: "\"Solid application\" - Professor Wong" },
    { name: "Katy Stuparu",      position: "Team Coach", photo: KatyImg, quote: "I like Trains" },
];

const members: Person[] = [
    // Co-Leads
    { name: "Jacob Boyle", position: "Co-Lead", photo: JacobImg, quote: "\" \"You miss 100% of the shots you don't take\" - Wayne Gretzky\" - Michael Scott " },
    { name: "Thanh Ho",    position: "Co-Lead", photo: EmmaImg, quote: "\"haribo is love, haribo is life\" - Emma" },

    // Assistant Leads
    { name: "Margareth Hosie",       position: "Assistant Lead for Back-End", photo: MaggieImg, quote: "\" \"Sorry Im late, I'm afraid I got lost on the path of life\" - Kakashi Sensei\" - Masashi Kishimoto" },
    { name: "Keerthana Jayamoorthy", position: "Assistant Lead for Front-End", photo: KeethuImg, quote: "\"He who feeds you controls you\" - Thomas Sankara" },

    // Team
    {
        name:     "Stuvat Dash",
        position: "Front-End & Feature Software Engineer",
        photo:    StuvatImg, quote: "\"Something's broken, can you fix it?\" - Maggie & Christine"
    },
    { name: "Brandon Small",  position: "Front-End & Feature Engineer • Scrum Master", photo: BrandonImg, quote: "\"Sometimes... the journey is umm, sometimes, friends..., real journey is friends along the way\"" },
    { name: "Delia Jasper",   position: "Front-End & Feature Engineer", photo: DeliaImg, quote: "I like Trains" },
    { name: "Lucien La Rock", position: "Front-End & Feature Engineer • Project Manager", photo: LucienImg, quote: "\"There's a reason you guys are last\"-Professor Wong" },
    { name: "Christine Ngo",  position: "Back-End Database Engineer & Product Owner", photo: ChristineImg, quote: "\"Once you meet someone, you never really forget them. It just takes a while for your memory o come back to you.\" - Zeniba, Sprited Away" },
    { name: "Ali Riad",       position: "Algorithms & Feature Engineer", photo: AliImg, quote: "I like Trains" },
    { name: "Jiaming Du",     position: "Algorithms & Feature Engineer", photo: JiamingImg, quote: "I like Trains" },
];


const FlipCard: React.FC<Person> = ({ name, position, photo, quote }) => {
    const [flipped, setFlipped] = useState(false);

    return (
        <div
            className="w-80 h-48 cusor-pointer "
            style = {{perspective: "1000px"}}
            onClick={() => setFlipped(!flipped)}
        >
            <div
                className={`relative w-full h-full duration-700 transition-transform ${
                    flipped ? "[transform:rotateY(180deg)]" : ""
                }`}
                style={{transformStyle: "preserve-3d"}}
            >
                <div className="absolute w-full h-full bg-white border rounded-xl shadow-md flex items-center justify-center"
                     style={{backfaceVisibility: "hidden"}}>
                    {/*Front*/}
                    <div className="flex flex-col items-center">
                        <img
                            src={photo}
                            alt={name}
                            className="w-24 h-24 rounded-full object-cover mb-3 shrink-0"
                        />
                        <h3 className="text-lg font-semibold text-center">{name}</h3>
                        <p className="text-sm text-gray-600 text-center">{position}</p>
                    </div>
                </div>
                {/*Back*/}
                <div className="absolute w-full h-full bg-white border rounded-xl px-2 shadow-md flex items-center justify-center"
                     style={{
                         transform: "rotateY(180deg)",
                         backfaceVisibility: "hidden",
                     }}>
                    <p className="text-lg font-semibold">{quote}</p>
                </div>
            </div>
        </div>
    );
}

/*  Page component */
const About: React.FC = () => (
    <main className="min-h-screen bg-slate-50 py-10 px-4 flex flex-col items-center">
        {/* Header */}
        <section className="max-w-5xl w-full text-center mb-10 space-y-1">
            <h1 className="text-3xl font-bold text-blue-900">About This Project</h1>
            <p>WPI Computer Science Department • CS3733-D25 Software Engineering</p>
        </section>

        {/* Faculty */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl w-full mb-12">
            {faculty.map((p) => (
                <FlipCard key={p.name} {...p} />
            ))}
        </section>

        {/* Team-member grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
            {members.map((p) => (
                <FlipCard key={p.name} {...p} />
            ))}
        </section>

        {/* Footer */}
        <footer className="max-w-4xl w-full mt-12 text-center text-sm text-gray-600">
            <p>
                Thank you to Brigham&nbsp;&amp;&nbsp;Women’s Hospital and their
                representative, <span className="font-medium">Andrew Shinn</span>.
            </p>
            The Brigham&nbsp;&amp;&nbsp;Women’s Hospital maps and data used in this
            application are copyrighted and provided solely for educational
            purposes.
        </footer>
    </main>
);

export default About;
