import React from 'react';
import TechCitationCard from '@/components/CitationCard';
import { Tech } from '@/components/CitationPopup'; // Ensure correct path

interface Tech {
    name: string;
    logoSrc: string;
    projectUsage: string;
    generalPurpose: string;
    documentationLink: string;
}

const technologiesUsed: Tech[] = [
    // PERN Stack
    {
        name: 'PostgreSQL',
        logoSrc: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/800px-Postgresql_elephant.svg.png',
        projectUsage: 'Used as the relational database to store and manage application data.',
        generalPurpose: 'A powerful, open-source relational database management system known for its reliability and advanced features.',
        documentationLink: 'https://www.postgresql.org/docs/',
    },
    {
        name: 'Express.js',
        logoSrc: 'https://buttercms.com/static/images/tech_banners/ExpressJS.png',
        projectUsage: 'A lightweight backend framework used to build the API and handle server-side logic.',
        generalPurpose: 'A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.',
        documentationLink: 'https://expressjs.com/',
    },
    {
        name: 'React',
        logoSrc: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
        projectUsage: 'The frontend library used for building the user interface with reusable components.',
        generalPurpose: 'A JavaScript library for building dynamic and interactive user interfaces with a component-based architecture.',
        documentationLink: 'https://react.dev/',
    },
    {
        name: 'Node.js',
        logoSrc: 'https://nodejs.org/static/images/logo.svg',
        projectUsage: 'The JavaScript runtime environment that powers the backend server and development tools.',
        generalPurpose: 'A JavaScript runtime built on Chrome\'s V8 JavaScript engine, enabling server-side JavaScript execution.',
        documentationLink: 'https://nodejs.org/',
    },

    // Code management and dev libraries
    {
        name: 'Yarn',
        logoSrc: 'https://th.bing.com/th/id/OIP.m9u-T43srIyuGcR0r8wlAAHaHa?rs=1&pid=ImgDetMain',
        projectUsage: 'Used as the package manager for managing project dependencies efficiently.',
        generalPurpose: 'A package manager for JavaScript code that provides fast, reliable, and secure dependency management.',
        documentationLink: 'https://yarnpkg.com/',
    },
    {
        name: 'TurboRepo',
        logoSrc: 'https://seeklogo.com/images/T/turborepo-logo-D9CF2C830E-seeklogo.com.png',
        projectUsage: 'A task runner for the monorepo, optimizing build and script execution.',
        generalPurpose: 'An intelligent build system for JavaScript and TypeScript monorepos that optimizes for speed and efficiency.',
        documentationLink: 'https://turbo.build/repo',
    },
    {
        name: 'ESLint',
        logoSrc: 'https://handwiki.org/wiki/images/thumb/e/e3/ESLint_logo.svg/640px-ESLint_logo.svg.png',
        projectUsage: 'Used for linting JavaScript and TypeScript code to maintain code quality and consistency.',
        generalPurpose: 'A static code analysis tool for identifying problematic patterns in JavaScript and TypeScript code.',
        documentationLink: 'https://eslint.org/',
    },
    {
        name: 'Prettier',
        logoSrc: 'https://prettier.io/icon.png',
        projectUsage: 'Used as a code formatter to enforce a consistent code style across the project.',
        generalPurpose: 'An opinionated code formatter that automatically formats code to ensure consistency.',
        documentationLink: 'https://prettier.io/',
    },
    {
        name: 'Husky',
        logoSrc: 'https://www.kobzarev.com/wp-content/uploads/2020/11/husky-git-hook.jpg',
        projectUsage: 'Integrated with Git hooks to automatically run linters and formatters before commits.',
        generalPurpose: 'A tool that makes it easy to use Git hooks, allowing you to run scripts during Git actions.',
        documentationLink: 'https://typicode.github.io/husky/',
    },
    {
        name: 'TypeScript',
        logoSrc: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/512px-Typescript_logo_2020.svg.png?20221110153201',
        projectUsage: 'The primary language used for the project, providing static typing for improved code quality.',
        generalPurpose: 'A superset of JavaScript that adds optional static typing to the language.',
        documentationLink: 'https://www.typescriptlang.org/',
    },

    // Frontend Technologies
    {
        name: 'Shadcn UI',
        logoSrc: 'https://suhelmakkad.gallerycdn.vsassets.io/extensions/suhelmakkad/shadcn-ui/0.1.1/1695843310552/Microsoft.VisualStudio.Services.Icons.Default',
        projectUsage: 'Provides a set of reusable and accessible UI components built with Radix UI and styled with Tailwind CSS, accelerating frontend development.',
        generalPurpose: 'A collection of beautifully designed and accessible UI components that you can copy and paste into your React apps.',
        documentationLink: 'https://shadcn-ui.com/',
    },
    {
        name: 'Figma',
        logoSrc: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Figma-logo.svg/1200px-Figma-logo.svg.png',
        projectUsage: 'Used for UI/UX design and collaboration on the application interface.',
        generalPurpose: 'A web-based design and prototyping tool for creating user interfaces and experiences.',
        documentationLink: 'https://www.figma.com/',
    },
    {
        name: 'Tailwind CSS',
        logoSrc: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg',
        projectUsage: 'A utility-first CSS framework used for styling the application with speed and consistency.',
        generalPurpose: 'A utility-first CSS framework packed with classes like `flex`, `pt-4`, `bg-red-500`, `text-center` that let you build custom designs right in your HTML.',
        documentationLink: 'https://tailwindcss.com/',
    },
    {
        name: 'Vitest',
        logoSrc: 'https://vitest.dev/logo.svg',
        projectUsage: 'The JavaScript test runner used for writing and running unit and integration tests.',
        generalPurpose: 'A fast, modern, and developer-friendly JavaScript test runner powered by Vite.',
        documentationLink: 'https://vitest.dev/',
    },
    {
        name: 'Font Awesome',
        logoSrc: 'https://static-00.iconduck.com/assets.00/font-awesome-icon-1024x1024-n1norbzq.png',
        projectUsage: 'Used to incorporate scalable vector icons for UI elements, enhancing the visual design.',
        generalPurpose: 'A comprehensive icon library and toolkit used to add vector icons and social logos to websites.',
        documentationLink: 'https://fontawesome.com/',
    },

    // Backend Technologies
    {
        name: 'Google Maps API',
        logoSrc: 'https://logodownload.org/wp-content/uploads/2018/01/google-maps-logo-2-1.png',
        projectUsage: 'Integrated for providing map functionalities and location-based services within the application.',
        generalPurpose: 'A suite of APIs that allows developers to embed Google Maps into web and mobile applications, offering features like maps, routes, and places.',
        documentationLink: 'https://developers.google.com/maps/documentation',
    },
    {
        name: 'Auth0',
        logoSrc: 'https://th.bing.com/th/id/R.27670f6f3a305eaf2ae4050349de45c4?rik=tnFcWMfSBeXQDA&pid=ImgRaw&r=0',
        projectUsage: 'Used for secure user authentication and authorization within the application.',
        generalPurpose: 'A platform that provides authentication and authorization services for web, mobile, and legacy applications.',
        documentationLink: 'https://auth0.com/docs/',
    },
    {
        name: 'Prisma',
        logoSrc: 'https://i.pinimg.com/originals/39/b2/e4/39b2e4ad77c23a2c11e5950a7dfa2aec.png',
        projectUsage: 'An ORM used to interact with the PostgreSQL database in a type-safe manner.',
        generalPurpose: 'A next-generation ORM for Node.js and TypeScript that makes database access easy and safe.',
        documentationLink: 'https://www.prisma.io/',
    },
    {
        name: 'Axios',
        logoSrc: 'https://user-images.githubusercontent.com/8939680/57233884-20344080-6fe5-11e9-8df3-0df1282e1574.png',
        projectUsage: 'Used to simplify the process of sending asynchronous HTTP requests to REST endpoints and handling responses.',
        generalPurpose: 'A popular open-source JavaScript library used to make HTTP requests from web browsers or Node.js environments.',
        documentationLink: 'https://www.postgresql.org/docs/',
    },
    {
        name: 'Docker',
        logoSrc: 'https://www.docker.com/wp-content/uploads/2022/03/vertical-logo-monochromatic.png',
        projectUsage: 'Used for containerizing the application to ensure consistent environments across development and production.',
        generalPurpose: 'A platform for developing, shipping, and running applications in isolated environments called containers.',
        documentationLink: 'https://www.docker.com/',
    },
    {
        name: 'Traefik',
        logoSrc: 'https://doc.traefik.io/traefik/assets/img/traefikproxy-vertical-logo-color.svg',
        projectUsage: 'Used as a reverse proxy in production to route traffic and handle TLS configuration.',
        generalPurpose: 'A modern reverse proxy and load balancer that makes deploying microservices easy.',
        documentationLink: 'https://doc.traefik.io/traefik/',
    },
    {
        name: 'AWS',
        logoSrc: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1024px-Amazon_Web_Services_Logo.svg.png',
        projectUsage: 'The cloud platform used to deploy and host the website and its backend services.',
        generalPurpose: 'A comprehensive and broadly adopted cloud platform, offering over 200 fully featured services from data centers globally.',
        documentationLink: 'https://aws.amazon.com/',
    },

    // Collaboration and Version Control
    {
        name: 'GitHub',
        logoSrc: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
        projectUsage: 'Used for version control, collaboration, and managing the project\'s codebase.',
        generalPurpose: 'A web-based platform for version control using Git, collaboration, and code hosting for software development.',
        documentationLink: 'https://github.com/',
    },
    {
        name: 'Discord',
        logoSrc: 'https://logodownload.org/wp-content/uploads/2017/11/discord-logo-0.png',
        projectUsage: 'Used for team communication and collaboration throughout the development process.',
        generalPurpose: 'A VoIP and instant messaging social platform used for creating communities and communicating via voice calls, video calls, text messaging, media and files.',
        documentationLink: 'https://discord.com/',
    },
];

interface TechCitationPageProps {
    technologies: Tech[];
}

const TechCitationPage: React.FC<TechCitationPageProps> = ({ technologies }) => {
    return (
        <div className="bg-[#F1F1F1] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-[#012D5A] mb-6">Technologies Used</h2>

            <div>
                <h3 className="text-xl font-semibold text-[#012D5A] mb-2">The PERN Stack</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {technologies.filter(tech => ['PostgreSQL', 'Express.js', 'React', 'Node.js'].includes(tech.name)).map((tech) => (
                        <TechCitationCard key={tech.name} tech={tech} />
                    ))}
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-semibold text-[#012D5A] mb-2">Code Management and Development Libraries</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {technologies.filter(tech => ['Yarn', 'TurboRepo', 'ESLint', 'Prettier', 'Husky', 'TypeScript'].includes(tech.name)).map((tech) => (
                        <TechCitationCard key={tech.name} tech={tech} />
                    ))}
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-semibold text-[#012D5A] mb-2">Frontend Technologies</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {technologies.filter(tech => ['Shadcn UI', 'Figma', 'Tailwind CSS', 'React', 'Vitest', 'Font Awesome'].includes(tech.name)).map((tech) => (
                        <TechCitationCard key={tech.name} tech={tech} />
                    ))}
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-semibold text-[#012D5A] mb-2">Backend Technologies</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {technologies.filter(tech => ['Google Maps API', 'Auth0', 'Prisma','Axios', 'Docker', 'Traefik', 'AWS'].includes(tech.name)).map((tech) => (
                        <TechCitationCard key={tech.name} tech={tech} />
                    ))}
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-semibold text-[#012D5A] mb-2">Collaboration and Version Control</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {technologies.filter(tech => ['GitHub', 'Discord'].includes(tech.name)).map((tech) => (
                        <TechCitationCard key={tech.name} tech={tech} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const CitationsPage: React.FC = () => {
    return <TechCitationPage technologies={technologiesUsed} />;
};

export default CitationsPage;