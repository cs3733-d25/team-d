import React from "react";

type Person = { name: string; position: string };

const faculty: Person[] = [
    { name: "Prof. Wilson Wong", position: "Course Instructor" },
    { name: "Katy Stuparu", position: "Team Coach" },
];

const members: Person[] = [
    // Co-Leads
    { name: "Jacob Boyle",       position: "Co-Lead (Front & Back-End)" },
    { name: "Thanh Ho",          position: "Co-Lead (Front & Back-End)" },

    // Assistant Leads
    { name: "Keerthana Jayamoorthy", position: "Assistant Lead for Front-End" },
    { name: "Margareth Hosie",   position: "Assistant Lead for Back-End" },

    { name: "Stuvat Dash",       position: "Front-End & Feature Software Engineer" },
    { name: "Jiaming Du",        position: "Algorithms & Feature Engineer" },
    { name: "Delia Jasper",      position: "Front-End & Feature Engineer" },
    { name: "Lucien La Rock",    position: "Front-End & Feature Engineer / Doc Analyst / PM" },
    { name: "Christine Ngo",     position: "Back-End DB Engineer & Product Owner" },
    { name: "Ali Riad",          position: "Algorithms & Feature Engineer" },
    { name: "Brandon Small",     position: "Front-End & Feature Engineer • Scrum Master" },
];

const Card: React.FC<Person> = ({ name, position }) => (
    <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition">
        {/* empty photo slot */}
        <div className="w-24 h-24 rounded-full bg-gray-200 mb-3 shrink-0" />
        <h3 className="text-lg font-semibold text-center">{name}</h3>
        <p className="text-sm text-gray-600 text-center">{position}</p>
    </div>
);

const About: React.FC = () => (
    <main className="min-h-screen bg-slate-50 py-10 px-4 flex flex-col items-center">
        {/* Header */}
        <section className="max-w-5xl w-full text-center mb-10 space-y-1">
            <h1 className="text-3xl font-bold text-blue-900">About This Project</h1>
            <p>WPI Computer Science Department • CS3733-D25 Software Engineering</p>
            <p>
                Thank you to Brigham &amp; Women’s Hospital and their representative,{" "}
                <span className="font-medium">Andrew Shinn</span>.
            </p>
        </section>

        {/* Faculty / Coach row */}
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

        {/* Footer note */}
        <footer className="max-w-4xl w-full mt-12 text-center text-sm text-gray-600">
            The Brigham &amp; Women’s Hospital maps and data used in this application
            are copyrighted and provided for the sole use of educational purposes.
        </footer>
    </main>
);

export default About;
