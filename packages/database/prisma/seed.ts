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