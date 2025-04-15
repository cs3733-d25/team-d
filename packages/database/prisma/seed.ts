import {PrismaClient} from '../.prisma/client';
const prisma = new PrismaClient();


async function main() {

    // Seed employees
    console.log('Seeding employees...');
    const employees = [
        await prisma.employee.upsert({
            where: {employeeId: 1},
            update: {},
            create: {
                email: 'jlsmith@gmail.com',
                password: 'rhe0324!',
                firstName: 'Jen',
                middleInitial: 'L',
                lastName: 'Smith',
                occupation: 'Nurse'
            }
        }),
        await prisma.employee.upsert({
            where: {employeeId: 2},
            update: {},
            create: {
                email: 'mkhaven@gmail.com',
                password: 'ehw2153!',
                firstName: 'Matthew',
                middleInitial: 'K',
                lastName: 'Haven',
                occupation: 'Doctor'
            }
        }),
        await prisma.employee.upsert({
            where: {employeeId: 3},
            update: {},
            create: {
                email: 'palong@gmail.com',
                password: 'jye4832!',
                firstName: 'Piper',
                middleInitial: 'A',
                lastName: 'Long',
                occupation: 'Nurse'
            }
        }),
        await prisma.employee.upsert({
            where: {employeeId: 4},
            update: {},
            create: {
                email: 'nrlee@gmail.com',
                password: 'gsl9472!',
                firstName: 'Nicole',
                middleInitial: 'R',
                lastName: 'Lee',
                occupation: 'Administrator'
            }
        }),
        await prisma.employee.upsert({
            where: {employeeId: 5},
            update: {},
            create: {
                email: 'kkramos@gmail.com',
                password: 'dhs9572!',
                firstName: 'Karina',
                middleInitial: 'K',
                lastName: 'Ramos',
                occupation: 'Doctor'
            }
        })
    ];
    console.log('Employees seeded!');

    console.log(employees);

    // Seed translator requests
    console.log('Seeding translator requests...');
    const serviceRequests = [
        await prisma.serviceRequest.upsert({
            where: { requestId: 1},
            update: {},
            create: {
                assignedEmployeeId: null,
            },
        }),
        await prisma.serviceRequest.upsert({
            where: { requestId: 2},
            update: {},
            create: {
                assignedEmployeeId: 1,
            },
        }),
        await prisma.serviceRequest.upsert({
            where: { requestId: 3},
            update: {},
            create: {
                assignedEmployeeId: 2,
            },
        }),
        await prisma.serviceRequest.upsert({
            where: { requestId: 4},
            update: {},
            create: {
                assignedEmployeeId: null,
            },
        }),
        await prisma.serviceRequest.upsert({
            where: { requestId: 5},
            update: {},
            create: {
                assignedEmployeeId: 3,
            },
        }),
        await prisma.serviceRequest.upsert({
            where: { requestId: 6},
            update: {},
            create: {
                assignedEmployeeId: null,
            },
        }),
        await prisma.serviceRequest.upsert({
            where: { requestId: 7},
            update: {},
            create: {
                assignedEmployeeId: 4,
            },
        }),
        await prisma.serviceRequest.upsert({
            where: { requestId: 8},
            update: {},
            create: {
                assignedEmployeeId: 3,
            },
        }),
        await prisma.serviceRequest.upsert({
            where: { requestId: 9},
            update: {},
            create: {
                assignedEmployeeId: null,
            },
        }),
        await prisma.serviceRequest.upsert({
            where: { requestId: 10},
            update: {},
            create: {
                assignedEmployeeId: null,
            },
        }),
        await prisma.serviceRequest.upsert({
            where: { requestId: 11},
            update: {},
            create: {
                assignedEmployeeId: null,
            },
        }),
    ];
    const translatorRequests = [
        await prisma.translatorRequest.upsert({
            where: {serviceRequestId: serviceRequests[0].requestId},
            update: {},
            create: {
                serviceRequestId: serviceRequests[0].requestId,
                languageFrom: 'Vietnamese',
                languageTo: 'English',
                roomNum: '302',
                startDateTime: new Date('2025-04-01T22:07:00.639Z'),
                endDateTime: new Date('2025-04-01T22:07:45.639Z'),
            }
        }),
        await prisma.translatorRequest.upsert({
            where: {serviceRequestId: serviceRequests[1].requestId},
            update: {},
            create: {
                serviceRequestId: serviceRequests[1].requestId,
                languageFrom: 'Spanish',
                languageTo: 'English',
                roomNum: '207',
                startDateTime: new Date('2025-04-11T22:04:30.639Z'),
                endDateTime: new Date('2025-04-11T22:05:00.639Z'),
            },
        }),
        await prisma.translatorRequest.upsert({
            where: {serviceRequestId: serviceRequests[2].requestId},
            update: {},
            create: {
                serviceRequestId: serviceRequests[2].requestId,
                languageFrom: 'English',
                languageTo: 'Portuguese',
                roomNum: '119',
                startDateTime: new Date('2025-04-18T22:05:00.639Z'),
                endDateTime: new Date('2025-04-18T22:05:40.639Z'),
            },
        }),
        await prisma.translatorRequest.upsert({
            where: {serviceRequestId: serviceRequests[3].requestId},
            update: {},
            create: {
                serviceRequestId: serviceRequests[3].requestId,
                languageFrom: 'Chinese',
                languageTo: 'English',
                roomNum: '222',
                startDateTime: new Date('2025-04-02T22:01:15.639Z'),
                endDateTime: new Date('2025-04-02T22:02:00.639Z'),
            },
        }),
        await prisma.translatorRequest.upsert({
            where: {serviceRequestId: serviceRequests[4].requestId},
            update: {},
            create: {
                serviceRequestId: serviceRequests[4].requestId,
                languageFrom: 'English',
                languageTo: 'Vietnamese',
                roomNum: '129',
                startDateTime: new Date('2025-05-27T22:09:00.639Z'),
                endDateTime: new Date('2025-05-27T22:09:45.639Z'),
            },
        }),
        await prisma.translatorRequest.upsert({
            where: {serviceRequestId: serviceRequests[5].requestId},
            update: {},
            create: {
                serviceRequestId: serviceRequests[5].requestId,
                languageFrom: 'German',
                languageTo: 'Spanish',
                roomNum: '311',
                startDateTime: new Date('2025-04-15T22:09:20.639Z'),
                endDateTime: new Date('2025-04-15T22:08:45.639Z'),
            },
        }),
        await prisma.translatorRequest.upsert({
            where: {serviceRequestId: serviceRequests[6].requestId},
            update: {},
            create: {
                serviceRequestId: serviceRequests[6].requestId,
                languageFrom: 'Korean',
                languageTo: 'English',
                roomNum: '104',
                startDateTime: new Date('2025-06-01T22:02:30.639Z'),
                endDateTime: new Date('2025-06-01T22:03:30.639Z'),
            },
        }),
        await prisma.translatorRequest.upsert({
            where: {serviceRequestId: serviceRequests[7].requestId},
            update: {},
            create: {
                serviceRequestId: serviceRequests[7].requestId,
                languageFrom: 'English',
                languageTo: 'Russian',
                roomNum: '333',
                startDateTime: new Date('2025-05-11T22:04:00.639Z'),
                endDateTime: new Date('2025-05-11T22:04:45.639Z'),
            },
        }),
        await prisma.translatorRequest.upsert({
            where: {serviceRequestId: serviceRequests[8].requestId},
            update: {},
            create: {
                serviceRequestId: serviceRequests[8].requestId,
                languageFrom: 'French',
                languageTo: 'English',
                roomNum: '234',
                startDateTime: new Date('2025-04-28T22:07:00.639Z'),
                endDateTime: new Date('2025-04-28T22:07:45.639Z'),
            },
        }),
        await prisma.translatorRequest.upsert({
            where: {serviceRequestId: serviceRequests[9].requestId},
            update: {},
            create: {
                serviceRequestId: serviceRequests[9].requestId,
                languageFrom: 'English',
                languageTo: 'Chinese',
                roomNum: '232',
                startDateTime: new Date('2025-05-29T22:09:00.639Z'),
                endDateTime: new Date('2025-05-29T22:10:30.639Z'),
            },
        }),
        await prisma.translatorRequest.upsert({
            where: {serviceRequestId: serviceRequests[10].requestId},
            update: {},
            create: {
                serviceRequestId: serviceRequests[10].requestId,
                languageFrom: 'Spanish',
                languageTo: 'French',
                roomNum: '119',
                startDateTime: new Date('2025-06-20T22:10:30.639Z'),
                endDateTime: new Date('2025-06-20T22:11:15.639Z'),
            },
        }),
    ];
    console.log('Translator requests seeded!')

    console.log(translatorRequests);



    console.log('Seeding hospitals...')
    const hospitals = [
        await prisma.hospital.upsert({
            where: {hospitalId: 0},
            update: {
                hospitalId: 0,
                name: 'Chestnut Hill',
                placeId: 'ChIJLwkLvP5444kRGTnWxi0zsnM',
                defaultZoom: 19,
                defaultLat: 42.325956546246374,
                defaultLng: -71.14971804046458,
            },
            create: {
                hospitalId: 0,
                name: 'Chestnut Hill',
                placeId: 'ChIJLwkLvP5444kRGTnWxi0zsnM',
                defaultZoom: 19,
                defaultLat: 42.325956546246374,
                defaultLng: -71.14971804046458,
            },
        }),
        await prisma.hospital.upsert({
            where: {hospitalId: 1},
            update: {
                hospitalId: 1,
                name: 'Patriot Place',
                placeId: 'ChIJKQrcBrd85IkRhhpDZMarvhQ',
                defaultZoom: 18,
                defaultLat: 42.09179246168661,
                defaultLng: -71.26649009979019,
            },
            create: {
                hospitalId: 1,
                name: 'Patriot Place',
                placeId: 'ChIJKQrcBrd85IkRhhpDZMarvhQ',
                defaultZoom: 18,
                defaultLat: 42.09179246168661,
                defaultLng: -71.26649009979019,
            },
        }),
    ];

    console.log('Hospitals seeded!');
    console.log(hospitals);

    console.log('Seeding floors...');

    const floors = [
        await prisma.floor.upsert({
            where: {floorId: 0},
            update: {
                floorId: 0,
                num: 1,
                imageURL: '/src/public/floormaps/chf1.png',
                north: 42.32629,
                south: 42.32569,
                east: -71.14921,
                west: -71.15013,
                hospitalId: 0,
            },
            create: {
                floorId: 0,
                num: 1,
                imageURL: '/src/public/floormaps/chf1.png',
                north: 42.32629,
                south: 42.32569,
                east: -71.14921,
                west: -71.15013,
                hospitalId: 0,
            },
        }),
        await prisma.floor.upsert({
            where: {floorId: 1},
            update: {
                floorId: 1,
                num: 1,
                imageURL: '/src/public/floormaps/pp20f1.png',
                north: 42.09310,
                south: 42.09246,
                east: -71.26553,
                west: -71.26657,
                hospitalId: 1,
            },
            create: {
                floorId: 1,
                num: 1,
                imageURL: '/src/public/floormaps/pp20f1.png',
                north: 42.09310,
                south: 42.09246,
                east: -71.26553,
                west: -71.26657,
                hospitalId: 1,
            },
        }),
        await prisma.floor.upsert({
            where: {floorId: 2},
            update: {
                floorId: 2,
                num: 3,
                imageURL: '/src/public/floormaps/pp22f3.png',
                north: 42.09308,
                south: 42.09223,
                east: -71.26654,
                west: -71.26744,
                hospitalId: 1,
            },
            create: {
                floorId: 2,
                num: 3,
                imageURL: '/src/public/floormaps/pp22f3.png',
                north: 42.09308,
                south: 42.09223,
                east: -71.26654,
                west: -71.26744,
                hospitalId: 1,
            },
        }),
        await prisma.floor.upsert({
            where: {floorId: 3},
            update: {
                floorId: 3,
                num: 4,
                imageURL: '/src/public/floormaps/pp22f4.png',
                north: 42.09308,
                south: 42.09223,
                east: -71.26654,
                west: -71.26744,
                hospitalId: 1,
            },
            create: {
                floorId: 3,
                num: 4,
                imageURL: '/src/public/floormaps/pp22f4.png',
                north: 42.09308,
                south: 42.09223,
                east: -71.26654,
                west: -71.26744,
                hospitalId: 1,
            },
        }),
    ];

    console.log('Floors seeded!');
    console.log(floors);

    console.log('Seeding departments...');
    const departments = [
        await prisma.department.upsert({
            where: {departmentId: 0},
            update: {
                departmentId: 0,
                name: 'Laboratory',
                suite: '100',
                floorId: 0,
            },
            create: {
                departmentId: 0,
                name: 'Laboratory',
                suite: '100',
                floorId: 0,
            },
        }),
        await prisma.department.upsert({
            where: {departmentId: 1},
            update: {
                departmentId: 1,
                name: 'Multi-Specialty Clinic',
                suite: '130',
                floorId: 0,
            },
            create: {
                departmentId: 1,
                name: 'Multi-Specialty Clinic',
                suite: '130',
                floorId: 0,
            },
        }),
        await prisma.department.upsert({
            where: {departmentId: 2},
            update: {
                departmentId: 2,
                name: 'Radiology, MRI/CT scan',
                suite: '102B',
                floorId: 0,
            },
            create: {
                departmentId: 2,
                name: 'Radiology, MRI/CT scan',
                suite: '102B',
                floorId: 0,
            },
        }),
        await prisma.department.upsert({
            where: {departmentId: 3},
            update: {
                departmentId: 3,
                name: 'Blood Draw / Phlebotomy (20 floor 1)',
                suite: '',
                floorId: 1,
            },
            create: {
                departmentId: 3,
                name: 'Blood Draw / Phlebotomy (20 floor 1)',
                suite: '',
                floorId: 1,
            },
        }),
        await prisma.department.upsert({
            where: {departmentId: 4},
            update: {
                departmentId: 4,
                name: 'Pharmacy',
                suite: '',
                floorId: 1,
            },
            create: {
                departmentId: 4,
                name: 'Pharmacy',
                suite: '',
                floorId: 1,
            },
        }),
        await prisma.department.upsert({
            where: {departmentId: 5},
            update: {
                departmentId: 5,
                name: 'Radiology',
                suite: '',
                floorId: 1,
            },
            create: {
                departmentId: 5,
                name: 'Radiology',
                suite: '',
                floorId: 1,
            },
        }),
        await prisma.department.upsert({
            where: {departmentId: 6},
            update: {
                departmentId: 6,
                name: 'Cardiovascular Services',
                suite: '',
                floorId: 1,
            },
            create: {
                departmentId: 6,
                name: 'Cardiovascular Services',
                suite: '',
                floorId: 1,
            },
        }),
        await prisma.department.upsert({
            where: {departmentId: 7},
            update: {
                departmentId: 7,
                name: 'Urology',
                suite: '',
                floorId: 1,
            },
            create: {
                departmentId: 7,
                name: 'Urology',
                suite: '',
                floorId: 1,
            },
        }),
        await prisma.department.upsert({
            where: {departmentId: 8},
            update: {
                departmentId: 8,
                name: 'Urgent Care Center',
                suite: '',
                floorId: 1,
            },
            create: {
                departmentId: 8,
                name: 'Urgent Care Center',
                suite: '',
                floorId: 1,
            },
        }),
        await prisma.department.upsert({
            where: {departmentId: 9},
            update: {
                departmentId: 9,
                name: 'Multi Specialty Clinic',
                suite: '',
                floorId: 2,
            },
            create: {
                departmentId: 9,
                name: 'Multi Specialty Clinic',
                suite: '',
                floorId: 2,
            },
        }),
        await prisma.department.upsert({
            where: {departmentId: 10},
            update: {
                departmentId: 10,
                name: 'Patient Financial Services',
                suite: '',
                floorId: 2,
            },
            create: {
                departmentId: 10,
                name: 'Patient Financial Services',
                suite: '',
                floorId: 2,
            },
        }),
        await prisma.department.upsert({
            where: {departmentId: 11},
            update: {
                departmentId: 11,
                name: 'Blood Draw / Phlebotomy (22 floor 4)',
                suite: '',
                floorId: 3,
            },
            create: {
                departmentId: 11,
                name: 'Blood Draw / Phlebotomy (22 floor 4)',
                suite: '',
                floorId: 3,
            },
        }),
        await prisma.department.upsert({
            where: {departmentId: 12},
            update: {
                departmentId: 12,
                name: 'Community Room',
                suite: '',
                floorId: 3,
            },
            create: {
                departmentId: 12,
                name: 'Community Room',
                suite: '',
                floorId: 3,
            },
        }),
        await prisma.department.upsert({
            where: {departmentId: 13},
            update: {
                departmentId: 13,
                name: 'Primary Care',
                suite: '',
                floorId: 3,
            },
            create: {
                departmentId: 13,
                name: 'Primary Care',
                suite: '',
                floorId: 3,
            },
        }),
    ];

    console.log('Departments seeded!');
    console.log(departments);


    // console.log('Seeding hospitals...')
    // const hospitals = [
    //     await prisma.hospital.upsert({
    //         where: {hospitalId: 0},
    //         update: {},
    //         create: {
    //             hospitalId: 0,
    //             name: 'Chestnut Hill',
    //             placeId: 'ChIJLwkLvP5444kRGTnWxi0zsnM',
    //             defaultZoom: 20,
    //             defaultLat: 42.325956546246374,
    //             defaultLong: -71.14971804046458,
    //         },
    //     }),
    //     await prisma.hospital.upsert({
    //         where: {hospitalId: 1},
    //         update: {},
    //         create: {
    //             hospitalId: 1,
    //             name: '20 Patriot Place',
    //             placeId: 'ChIJHzla42V95IkR_bz0ni4NvfI',
    //             defaultZoom: 20,
    //             defaultLat: 42.09281274014584,
    //             defaultLong: -71.26612984263076,
    //         },
    //     }),
    //     await prisma.hospital.upsert({
    //         where: {hospitalId: 2},
    //         update: {},
    //         create: {
    //             hospitalId: 2,
    //             name: '22 Patriot Place',
    //             placeId: 'ChIJKQrcBrd85IkRhhpDZMarvhQ',
    //             defaultZoom: 20,
    //             defaultLat: 42.09265139820163,
    //             defaultLong: -71.2669845235888,
    //         },
    //     }),
    // ];
    //
    // console.log('Hospitals seeded!');
    // console.log(hospitals);
    //
    // console.log('Seeding floors...');
    //
    // const floors = [
    //     await prisma.floor.upsert({
    //         where: {floorId: 0},
    //         update: {},
    //         create: {
    //             floorId: 0,
    //             num: 1,
    //             imageURL: '',
    //             hospitalId: 0,
    //         },
    //     }),
    //     await prisma.floor.upsert({
    //         where: {floorId: 1},
    //         update: {},
    //         create: {
    //             floorId: 1,
    //             num: 1,
    //             imageURL: '',
    //             hospitalId: 1,
    //         },
    //     }),
    //     await prisma.floor.upsert({
    //         where: {floorId: 2},
    //         update: {},
    //         create: {
    //             floorId: 2,
    //             num: 3,
    //             imageURL: '',
    //             hospitalId: 2,
    //         },
    //     }),
    //     await prisma.floor.upsert({
    //         where: {floorId: 3},
    //         update: {},
    //         create: {
    //             floorId: 3,
    //             num: 4,
    //             imageURL: '',
    //             hospitalId: 2,
    //         },
    //     }),
    // ];
    //
    // console.log('Floors seeded!');
    // console.log(floors);
    //
    // console.log('Seeding departments...');
    // const departments = [
    //     await prisma.department.upsert({
    //         where: {departmentId: 0},
    //         update: {},
    //         create: {
    //             departmentId: 0,
    //             name: 'Laboratory',
    //             suite: '100',
    //             floorId: 0,
    //         },
    //     }),
    //     await prisma.department.upsert({
    //         where: {departmentId: 1},
    //         update: {},
    //         create: {
    //             departmentId: 1,
    //             name: 'Multi-Specialty Clinic',
    //             suite: '130',
    //             floorId: 0,
    //         },
    //     }),
    //     await prisma.department.upsert({
    //         where: {departmentId: 2},
    //         update: {},
    //         create: {
    //             departmentId: 2,
    //             name: 'Radiology, MRI/CT scan',
    //             suite: '102B',
    //             floorId: 0,
    //         },
    //     }),
    //     await prisma.department.upsert({
    //         where: {departmentId: 3},
    //         update: {},
    //         create: {
    //             departmentId: 3,
    //             name: 'Blood Draw / Phlebotomy',
    //             suite: '',
    //             floorId: 1,
    //         },
    //     }),
    //     await prisma.department.upsert({
    //         where: {departmentId: 4},
    //         update: {},
    //         create: {
    //             departmentId: 4,
    //             name: 'Pharmacy',
    //             suite: '',
    //             floorId: 1,
    //         },
    //     }),
    //     await prisma.department.upsert({
    //         where: {departmentId: 5},
    //         update: {},
    //         create: {
    //             departmentId: 5,
    //             name: 'Radiology',
    //             suite: '',
    //             floorId: 1,
    //         },
    //     }),
    //     await prisma.department.upsert({
    //         where: {departmentId: 6},
    //         update: {},
    //         create: {
    //             departmentId: 6,
    //             name: 'Cardiovascular Services',
    //             suite: '',
    //             floorId: 1,
    //         },
    //     }),
    //     await prisma.department.upsert({
    //         where: {departmentId: 7},
    //         update: {},
    //         create: {
    //             departmentId: 7,
    //             name: 'Urology',
    //             suite: '',
    //             floorId: 1,
    //         },
    //     }),
    //     await prisma.department.upsert({
    //         where: {departmentId: 8},
    //         update: {},
    //         create: {
    //             departmentId: 8,
    //             name: 'Urgent Care Center',
    //             suite: '',
    //             floorId: 1,
    //         },
    //     }),
    //     await prisma.department.upsert({
    //         where: {departmentId: 9},
    //         update: {},
    //         create: {
    //             departmentId: 9,
    //             name: 'Multi Specialty Clinic',
    //             suite: '',
    //             floorId: 2,
    //         },
    //     }),
    //     await prisma.department.upsert({
    //         where: {departmentId: 10},
    //         update: {},
    //         create: {
    //             departmentId: 10,
    //             name: 'Patient Financial Services',
    //             suite: '',
    //             floorId: 2,
    //         },
    //     }),
    //     await prisma.department.upsert({
    //         where: {departmentId: 11},
    //         update: {},
    //         create: {
    //             departmentId: 11,
    //             name: 'Blood Draw / Phlebotomy',
    //             suite: '',
    //             floorId: 3,
    //         },
    //     }),
    //     await prisma.department.upsert({
    //         where: {departmentId: 12},
    //         update: {},
    //         create: {
    //             departmentId: 12,
    //             name: 'Community Room',
    //             suite: '',
    //             floorId: 3,
    //         },
    //     }),
    //     await prisma.department.upsert({
    //         where: {departmentId: 13},
    //         update: {},
    //         create: {
    //             departmentId: 13,
    //             name: 'Primary Care',
    //             suite: '',
    //             floorId: 3,
    //         },
    //     }),
    // ];
    //
    // console.log('Departments seeded!');
    // console.log(departments);


    // Seed departments
    // console.log('Seeding departments...');
    // const departments = [
    //     await prisma.department.upsert({
    //         where: {departmentId: 1},
    //         update: {},
    //         create: {
    //             name: "Allergy and Clinical Immunology",
    //             floor: 3,
    //             suite: "301",
    //             specialtyServices:
    //                 "Allergy, (environmental, food, medication, and venoms), asthma, anaphylaxis, angioedema, sinusitis, and immunodeficiency",
    //             telephone: "(617) 732–9850",
    //         }
    //     }),
    //     await prisma.department.upsert({
    //         where: {departmentId: 2},
    //         update: {},
    //         create: {
    //             name: "Allergy and Clinical Immunology",
    //             floor: 5,
    //             suite: "540",
    //             specialtyServices:
    //                 "Allergy, (environmental, food, medication, and venoms), asthma, anaphylaxis, angioedema, sinusitis, and immunodeficiency",
    //             telephone: "(617) 732–9850",
    //         }
    //     }),
    //     await prisma.department.upsert({
    //         where: {departmentId: 3},
    //         update: {},
    //         create: {
    //             name: "Backup Child Care Center",
    //             floor: 2,
    //             suite: "210",
    //             specialtyServices: "Backup childcare for employees",
    //             hours:"Monday – Friday, 8 am–4:30 pm",
    //             telephone: "(617) 732–9543",
    //         }
    //     }),
    //     await prisma.department.upsert({
    //         where: {departmentId: 4},
    //         update: {},
    //         create: {
    //             name: "Brigham Dermatology Associates (BDA)",
    //             floor: 3,
    //             suite: "317",
    //             specialtyServices: "Medical and surgical dermatology",
    //             telephone: "(617) 732–9080",
    //         }
    //     }),
    //     await prisma.department.upsert({
    //         where: {departmentId: 5},
    //         update: {},
    //         create: {
    //             name: "Brigham Obstetrics and Gynecology Group (BOGG)",
    //             floor: 5,
    //             suite: "575",
    //             specialtyServices: "Gynecology, Obstetrics",
    //             telephone: "(617) 732–9100",
    //         }
    //     }),
    //     await prisma.department.upsert({
    //         where: {departmentId: 6},
    //         update: {},
    //         create: {
    //             name: "Brigham Physicians Group (BPG)",
    //             floor: 4,
    //             suite: "428",
    //             specialtyServices: "Adult Primary Care",
    //             telephone: "(617) 732–9900",
    //         }
    //     }),
    //     await prisma.department.upsert({
    //         where: {departmentId: 7},
    //         update: {},
    //         create: {
    //             name: "Brigham Physicians Group (BPG)",
    //             floor: 5,
    //             suite: "530",
    //             specialtyServices: "Adult Primary Care",
    //             telephone: "(617) 732–9900",
    //         }
    //     }),
    //     await prisma.department.upsert({
    //         where: {departmentId: 8},
    //         update: {},
    //         create: {
    //             name: "Brigham Psychiatric Specialities",
    //             floor: 3,
    //             suite: "303",
    //             specialtyServices: "Psychiatry, Psychology, Social Work",
    //             telephone: "(617) 732–9811",
    //         }
    //     }),
    //     await prisma.department.upsert({
    //         where: {departmentId: 9},
    //         update: {},
    //         create: {
    //             name: "Center for Pain Medicine",
    //             floor: 3,
    //             suite: "320",
    //             specialtyServices: "Multidisciplinary pain management",
    //             telephone: "(617) 732–9060",
    //         }
    //     }),
    //     await prisma.department.upsert({
    //         where: {departmentId: 10},
    //         update: {},
    //         create: {
    //             name: "Crohn's and Colitis Center",
    //             floor: 2,
    //             suite: "201",
    //             specialtyServices: "Crohn's disease, inflammatory bowel disease, infusion services, microscopic colitis, pulmonary, rheumatology, ulcerative colitis",
    //             telephone: "(617) 732–6389",
    //         }
    //     }),
    //     await prisma.department.upsert({
    //         where: {departmentId: 11},
    //         update: {},
    //         create: {
    //             name: "Endoscopy Center",
    //             floor: 2,
    //             suite: "202",
    //             specialtyServices: "Bacterial overgrowth breath test, colonoscopy, H. Pylori breath test, lactose malabsorption breath test, upper endoscopy",
    //             telephone: "(617) 732–7426",
    //         }
    //     }),
    //     await prisma.department.upsert({
    //         where: {departmentId: 12},
    //         update: {},
    //         create: {
    //             name: "Gretchen S. and Edward A. Fish Center for Women's Health",
    //             floor: 4,
    //             suite: "402",
    //             specialtyServices: "Cardiology, Dermatology (cosmetic, medical, and surgical), Endocrinology, Gastroenterology, Gynecology, Hematology, Infectious Diseases, Mental Health (social work), General neurology, Nutrition, Primary care, Pulmonary, Renal, Rheumatology, Sleep medicine, Women's Health (Menopause and Midlife Clinic, Obstetric Internal Medicine)\n",
    //             telephone: "(617) 732–9300",
    //         }
    //     }),
    //     await prisma.department.upsert({
    //         where: {departmentId: 13},
    //         update: {},
    //         create: {
    //             name: "Laboratory",
    //             floor: 1,
    //             suite: "100",
    //             specialtyServices: "Blood work, lab services",
    //             hours: "Mon–Fri, 7 a.m.–7 p.m.; Sat, 7 a.m.–3 p.m.",
    //             telephone: "(617) 732–9841",
    //         }
    //     }),
    //     await prisma.department.upsert({
    //         where: {departmentId: 14},
    //         update: {},
    //         create: {
    //             name: "Multi-Specialty Clinic",
    //             floor: 1,
    //             suite: "130",
    //             specialtyServices:
    //                 "Orthopedic surgery, Vascular surgery, Contact Dermatitis and Occupational Dermatology Program, Pain Medicine and Travel Medicine\n",
    //             telephone: "(617) 732–9500",
    //         }
    //     }),
    //     await prisma.department.upsert({
    //         where: {departmentId: 15},
    //         update: {},
    //         create: {
    //             name: "Osher Clinical Center for Integrative Health",
    //             floor: 4,
    //             suite: "422",
    //             specialtyServices: "Acupuncture, health coaching, chiropractic, craniosacral therapy, integrative medicine, structural massage & movement therapies, neurology (movement disorders and headache), echocardiography, and pulmonary.\n" +
    //                 "Educational courses: Integrative wellness courses are also offered.\n",
    //             telephone: "(617) 732–9700",
    //         }
    //     }),
    //     await prisma.department.upsert({
    //         where: {departmentId: 16},
    //         update: {},
    //         create: {
    //             name: "Patient Financial Services",
    //             floor: 2,
    //             suite: "204B",
    //             specialtyServices: "Patient financial counselling (Payment, Insurance, Billing questions)",
    //             telephone: "(617) 732–9677",
    //         }
    //     }),
    //     await prisma.department.upsert({
    //         where: {departmentId: 17},
    //         update: {},
    //         create: {
    //             name: "Pharmacy",
    //             floor: 3,
    //             suite: "317",
    //             specialtyServices: "Outpatient Pharmacy Service",
    //             hours: "(Monday - Friday, 9 am-4 pm excluding holidays)",
    //             telephone: "(617) 732–9040",
    //         }
    //     }),
    //     await prisma.department.upsert({
    //         where: {departmentId: 18},
    //         update: {},
    //         create: {
    //             name: "Radiology",
    //             floor: 5,
    //             suite: "560",
    //             specialtyServices: "Bone Density, Breast Imaging/Mammography, Ultrasound, X-Ray",
    //             telephone: "(617) 732–9801",
    //         }
    //     }),
    //     await prisma.department.upsert({
    //         where: {departmentId: 19},
    //         update: {},
    //         create: {
    //             name: "Radiology, MRI/CT scan",
    //             floor: 1,
    //             suite: "102B",
    //             specialtyServices: "CT scan, MRI, X-Ray",
    //             telephone: "(617) 732–9821",
    //         }
    //     }),
    //     await prisma.department.upsert({
    //         where: {departmentId: 20},
    //         update: {},
    //         create: {
    //             name: "Rehabilitation Services",
    //             floor: 2,
    //             suite: "200",
    //             specialtyServices: "Orthopedic, sports, neurologic and vestibular Physical Therapy, Men's and Women's pelvic floor Physical Therapy. Hand/Occupational, Therapy Speech Language Pathology",
    //             telephone: "(617) 732–9525",
    //         }
    //     })
    // ];
    // console.log('Departments seeded!');
    // console.log(departments);

    //seed nodes
    // console.log('Seeding Nodes...');
    // const nodes = [
    //     await prisma.node.upsert({
    //         where: {nodeId: 1},
    //         update: {},
    //         create: {
    //             name: 'entrance',
    //             xCoord: 705,
    //             yCoord: 1060,
    //         }
    //     }),
    //     await prisma.node.upsert({
    //         where: {nodeId: 2},
    //         update: {},
    //         create: {
    //             name: 'n1',
    //             xCoord: 360,
    //             yCoord: 500,
    //         }
    //     })
    // ];
    //
    // console.log('Nodes seeded!');
    // console.log(nodes);
    //
    //
    // //seed edges
    // console.log('Seeding Edges...');
    // const edges = [
    //     await prisma.edge.upsert({
    //         where: {edgeId: 1},
    //         update: {},
    //         create: {
    //             weight: 12,
    //             startNodeId: 1,
    //             endNodeId: 2,
    //         }
    //     })
    // ];
    //
    // console.log('Edges seeded!');
    // console.log(edges);


    console.log('Seeding graphs:');

    const graphs = [
        await prisma.graph.upsert({
            where: {graphId: 0},
            update: {
                graphId: 0,
                name: 'CH FL1',
                floorId: 0,
            },
            create: {
                graphId: 0,
                name: 'CH FL1',
                floorId: 0,
            },
        }),

        await prisma.graph.upsert({
            where: {graphId: 1},
            update: {
                graphId: 1,
                name: 'PP 20Fl1',
                floorId: 1,
            },
            create: {
                graphId: 1,
                name: 'PP 20FL1',
                floorId: 1,
            },
        }),


    ];

    console.log('Graphs seeded!');
    console.log(graphs);

    console.log('Seeding nodes:');

    const nodes = [
        // await prisma.node.upsert({
        //     where: {nodeId: 0},
        //     update: {
        //         nodeId: 0,
        //         name: 'Entrance',
        //         lat: 0,
        //         lng: 0,
        //         graphId: 0,
        //     },
        //     create: {
        //         nodeId: 0,
        //         name: 'Entrance',
        //         lat: 0,
        //         lng: 0,
        //         graphId: 0,
        //     },
        // }),
        // await prisma.node.upsert({
        //     where: {nodeId: 1},
        //     update: {
        //         nodeId: 1,
        //         name: 'Exit',
        //         lat: 1,
        //         lng: 1,
        //         graphId: 0,
        //     },
        //     create: {
        //         nodeId: 1,
        //         name: 'Exit',
        //         lat: 1,
        //         lng: 1,
        //         graphId: 0,
        //     },
        // }),



        await prisma.node.upsert({
            where: {nodeId: 0},
            update: {
                nodeId: 0,
                name: 'Start',
                lat: 42.32628328491628 ,
                lng: -71.14950027862017,
                graphId: 0,
            },
            create: {
                nodeId: 0,
                name: 'Start',
                lat: 42.32628328491628 ,
                lng: 71.14950027862017,
                graphId: 0,
            },
        }),

        await prisma.node.upsert({
            where: {nodeId: 1},
            update: {
                nodeId: 1,
                name: '',
                lat: 42.326241641547554 ,
                lng: 71.14951100745623,
                graphId: 0,
            },
            create: {
                nodeId: 1,
                name: '',
                lat: 42.326241641547554 ,
                lng: 71.14951100745623,
                graphId: 0,
            },
        }),



        await prisma.node.upsert({
            where: { nodeId: 2 },
            update: {
                nodeId: 2,
                name: '',
                lat: 42.32620495569991,
                lng: -71.14950832524721,
                graphId: 0,
            },
            create: {
                nodeId: 2,
                name: '',
                lat: 42.32620495569991,
                lng: -71.14950832524721,
                graphId: 0,
            },
        }),

        await prisma.node.upsert({
            where: { nodeId: 3 },
            update: {
                nodeId: 3,
                name: '',
                lat: 42.3262019811708,
                lng: -71.14959013262217,
                graphId: 0,
            },
            create: {
                nodeId: 3,
                name: '',
                lat: 42.3262019811708,
                lng: -71.14959013262217,
                graphId: 0,
            },
        }),

        await prisma.node.upsert({
            where: { nodeId: 4 },
            update: {
                nodeId: 4,
                name: '',
                lat: 42.32616926134112,
                lng: -71.14958745041315,
                graphId: 0,
            },
            create: {
                nodeId: 4,
                name: '',
                lat: 42.32616926134112,
                lng: -71.14958745041315,
                graphId: 0,
            },
        }),

        await prisma.node.upsert({
            where: { nodeId: 5 },
            update: {
                nodeId: 5,
                name: 'Check in',
                lat: 42.326144473580044,
                lng: -71.14964645901148,
                graphId: 0,
            },
            create: {
                nodeId: 5,
                name: 'Check in',
                lat: 42.326144473580044,
                lng: -71.14964645901148,
                graphId: 0,
            },
        }),


        //Patriot Place
        await prisma.node.upsert({
            where: { nodeId: 6 },
            update: {
                nodeId: 6,
                name: 'PP Parking lot: Gillette Stadium: Lot 22',
                lat: 42.09124112074461 ,
                lng: -71.26697356796514,
                graphId: 0,
            },
            create: {
                nodeId: 5,
                name: 'PP Parking lot: Gillette Stadium: Lot 22',
                lat: 42.09124112074461 ,
                lng: -71.26697356796514,
                graphId: 0,
            },
        }),

        await prisma.node.upsert({
            where: { nodeId: 6 },
            update: {
                nodeId: 6,
                name: 'PP Parking lot: Gillette Stadium: Lot 23',
                lat: 42.09124112074461,
                lng: -71.26697356796514,
                graphId: 0,
            },
            create: {
                nodeId: 6,
                name: 'PP Parking lot: Gillette Stadium: Lot 23',
                lat: 42.09124112074461,
                lng: -71.26697356796514,
                graphId: 0,
            },
        }),

        await prisma.node.upsert({
            where: { nodeId: 7 },
            update: {
                nodeId: 7,
                name: 'PP Parking lot: Gillette Stadium',
                lat: 42.08912260935516,
                lng: -71.27005934715271,
                graphId: 0,
            },
            create: {
                nodeId: 7,
                name: 'PP Parking lot: Gillette Stadium',
                lat: 42.08912260935516,
                lng: -71.27005934715271,
                graphId: 0,
            },
        }),

        await prisma.node.upsert({
            where: { nodeId: 8 },
            update: {
                nodeId: 8,
                name: 'PP Parking lot: Limo Parking',
                lat: 42.09305236722215,
                lng: -71.26820996403694,
                graphId: 0,
            },
            create: {
                nodeId: 8,
                name: 'PP Parking lot: Limo Parking',
                lat: 42.09305236722215,
                lng: -71.26820996403694,
                graphId: 0,
            },
        }),

        await prisma.node.upsert({
            where: { nodeId: 9 },
            update: {
                nodeId: 9,
                name: 'PP Parking lot: ADA Parking',
                lat: 42.095880863598175,
                lng: -71.26509811861098,
                graphId: 0,
            },
            create: {
                nodeId: 9,
                name: 'PP Parking lot: ADA Parking',
                lat: 42.095880863598175,
                lng: -71.26509811861098,
                graphId: 0,
            },
        }),

        await prisma.node.upsert({
            where: { nodeId: 10 },
            update: {
                nodeId: 10,
                name: 'PP Parking lot: Gillette Stadium: Lot 6',
                lat: 42.093978143089934,
                lng: -71.26427199823439,
                graphId: 0,
            },
            create: {
                nodeId: 10,
                name: 'PP Parking lot: Gillette Stadium: Lot 6',
                lat: 42.093978143089934,
                lng: -71.26427199823439,
                graphId: 0,
            },
        }),

        await prisma.node.upsert({
            where: { nodeId: 11 },
            update: {
                nodeId: 11,
                name: 'PP Parking lot: Gillette Stadium: Lot 13\n',
                lat: 42.09378707176781,
                lng: -71.26363899690688,
                graphId: 0,
            },
            create: {
                nodeId: 11,
                name: 'PP Parking lot: Gillette Stadium: Lot 13\n',
                lat: 42.09378707176781,
                lng: -71.26363899690688,
                graphId: 0,
            },
        }),

        await prisma.node.upsert({
            where: { nodeId: 12 },
            update: {
                nodeId: 12,
                name: 'PP Parking lot :Gillette Stadium: Lot 14B',
                lat: 42.094368232456105,
                lng: -71.26248580910168,
                graphId: 0,
            },
            create: {
                nodeId: 12,
                name: 'PP Parking lot: Gillette Stadium: Lot 14B',
                lat: 42.094368232456105,
                lng: -71.26248580910168,
                graphId: 0,
            },
        }),

        await prisma.node.upsert({
            where: { nodeId: 13 },
            update: {
                nodeId: 13,
                name: 'PP Parking lot: P9 Gate Gillette Stadium\n',
                lat: 42.09437221307804,
                lng: -71.26248580910168,
                graphId: 0,
            },
            create: {
                nodeId: 13,
                name: 'PP Parking lot: P9 Gate Gillette Stadium\n',
                lat: 42.09437221307804,
                lng: -71.26248580910168,
                graphId: 0,
            },
        }),

        await prisma.node.upsert({
            where: { nodeId: 14 },
            update: {
                nodeId: 14,
                name: 'PP Parking lot: Gillette Stadium Lot 20',
                lat: 42.08998291637353,
                lng: -71.26123851882737,
                graphId: 0,
            },
            create: {
                nodeId: 14,
                name: 'PP Parking lot: Gillette Stadium Lot 20',
                lat: 42.08998291637353,
                lng: -71.26123851882737,
                graphId: 0,
            },
        }),

        await prisma.node.upsert({
            where: { nodeId: 15 },
            update: {
                nodeId: 15,
                name: 'PP Parking lot: Parking Lot 51',
                lat: 42.08745647675202,
                lng: -71.26928676055769,
                graphId: 0,
            },
            create: {
                nodeId: 15,
                name: 'PP Parking lot: Parking Lot 51',
                lat: 42.08745647675202,
                lng: -71.26928676055769,
                graphId: 0,
            },
        }),







    ];

    console.log('Nodes seeded!');
    console.log(nodes);

    console.log('Seeding edges:');
    const edges = [
        // await prisma.edge.upsert({
        //     where: {edgeId: 0},
        //     update: {
        //         edgeId: 0,
        //         weight: 1,
        //         startNodeId: 0,
        //         endNodeId: 1,
        //     },
        //     create: {
        //         edgeId: 0,
        //         weight: 1,
        //         startNodeId: 0,
        //         endNodeId: 1,
        //     },
        // })
    ];










}






main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });