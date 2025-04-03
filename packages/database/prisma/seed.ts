console.log("Hello World");
import {PrismaClient} from '../.prisma/client';
const prisma = new PrismaClient();

async function main() {
    const employee1 = await prisma.employee.upsert({
        where: {employeeId: 1},
        update: {},
        create: {
            email: 'jlsmith@gmail.com',
            password: 'rhe0324!',
            firstName: 'Jenn',
            middleName: 'Lopez',
            lastName: 'Smith',
            occupation: 'Nurse'
        }
    })

    const employee2 = await prisma.employee.upsert({
        where: {employeeId: 2},
        update: {},
        create: {
            email: 'mkhaven@gmail.com',
            password: 'ehw2153!',
            firstName: 'Matthew',
            middleName: 'King',
            lastName: 'Haven',
            occupation: 'Doctor'
        }
    })

    const employee3 = await prisma.employee.upsert({
        where: {employeeId: 3},
        update: {},
        create: {
            email: 'palong@gmail.com',
            password: 'jye4832!',
            firstName: 'Piper',
            middleName: 'Autumn',
            lastName: 'Long',
            occupation: 'Nurse'
        }
    })

    const employee4 = await prisma.employee.upsert({
        where: {employeeId: 4},
        update: {},
        create: {
            email: 'nrlee@gmail.com',
            password: 'gsl9472!',
            firstName: 'Nicole',
            middleName: 'Rose',
            lastName: 'Lee',
            occupation: 'Administrator'
        }
    })

    const employee5 = await prisma.employee.upsert({
        where: {employeeId: 5},
        update: {},
        create: {
            email: 'kkramos@gmail.com',
            password: 'dhs9572!',
            firstName: 'Karina',
            middleName: 'Knight',
            lastName: 'Ramos',
            occupation: 'Doctor'
        }
    })
    
    const translatorRequests = [
        await prisma.translatorRequest.upsert({
            where: {requestId: 1},
            update: {},
            create: {
                requestId: 1,
                languageFrom: 'Vietnamese',
                languageTo: 'English',
                roomNumber: '302',
                startDateTime: '2025-04-01T22:07:00.639Z',
                endDateTime: '2025-04-01T22:07:45.639Z'
            }
        })
    ];


    await prisma.translatorRequest.upsert({
        where: {requestId: 2},
        update: {},
        create: {
            requestId: 2,
            languageFrom: 'Spanish',
            languageTo: 'English',
            roomNumber: '207',
            startDateTime: '2025-04-11T22:04:30.639Z',
            endDateTime: '2025-04-11T22:05:00.639Z',
            assignedEmployeeId: 1
        },
    })

    await prisma.translatorRequest.upsert({
        where: {requestId: 3},
        update: {},
        create: {
            requestId: 3,
            languageFrom: 'English',
            languageTo: 'Portuguese',
            roomNumber: '119',
            startDateTime: '2025-04-18T22:05:00.639Z',
            endDateTime: '2025-04-18T22:05:40.639Z',
            assignedEmployeeId: 2
        },
    })

    await prisma.translatorRequest.upsert({
        where: {requestId: 4},
        update: {},
        create: {
            requestId: 4,
            languageFrom: 'Chinese',
            languageTo: 'English',
            roomNumber: '222',
            startDateTime: '2025-04-02T22:01:15.639Z',
            endDateTime: '2025-04-02T22:02:00.639Z',
        },
    })

    await prisma.translatorRequest.upsert({
        where: {requestId: 5},
        update: {},
        create: {
            requestId: 5,
            languageFrom: 'English',
            languageTo: 'Vietnamese',
            roomNumber: '129',
            startDateTime: '2025-05-27T22:09:00.639Z',
            endDateTime: '2025-05-27T22:09:45.639Z',
        },
    })

    await prisma.translatorRequest.upsert({
        where: {requestId: 6},
        update: {},
        create: {
            requestId: 6,
            languageFrom: 'German',
            languageTo: 'Spanish',
            roomNumber: '311',
            startDateTime: '2025-04-15T22:09:20.639Z',
            endDateTime: '2025-04-15T22:08:45.639Z',
        },
    })

    await prisma.translatorRequest.upsert({
        where: {requestId: 7},
        update: {},
        create: {
            requestId: 7,
            languageFrom: 'Korean',
            languageTo: 'English',
            roomNumber: '104',
            startDateTime: '2025-06-01T22:02:30.639Z',
            endDateTime: '2025-06-01T22:03:30.639Z',
        },
    })

    await prisma.translatorRequest.upsert({
        where: {requestId: 8},
        update: {},
        create: {
            requestId: 8,
            languageFrom: 'English',
            languageTo: 'Russian',
            roomNumber: '333',
            startDateTime: '2025-05-11T22:04:00.639Z',
            endDateTime: '2025-05-11T22:04:45.639Z',
            assignedEmployeeId: 3
        },
    })

    await prisma.translatorRequest.upsert({
        where: {requestId: 9},
        update: {},
        create: {
            requestId: 9,
            languageFrom: 'French',
            languageTo: 'English',
            roomNumber: '234',
            startDateTime: '2025-04-28T22:07:00.639Z',
            endDateTime: '2025-04-28T22:07:45.639Z',
            assignedEmployeeId: 4
        },
    })

    await prisma.translatorRequest.upsert({
        where: {requestId: 10},
        update: {},
        create: {
            requestId: 10,
            languageFrom: 'English',
            languageTo: 'Chinese',
            roomNumber: '232',
            startDateTime: '2025-05-29T22:09:00.639Z',
            endDateTime: '2025-05-29T22:10:30.639Z',
            assignedEmployeeId: 5
        },
    })

    await prisma.translatorRequest.upsert({
        where: {requestId: 11},
        update: {},
        create: {
            requestId: 11,
            languageFrom: 'Spanish',
            languageTo: 'French',
            roomNumber: '119',
            startDateTime: '2025-06-20T22:10:30.639Z',
            endDateTime: '2025-06-20T22:11:15.639Z',
        },
    })

    // console.log({ translatorReq1, translatorReq2, translatorReq3, translatorReq4, translatorReq5, translatorReq6,translatorReq7,translatorReq8,
    //     translatorReq9, translatorReq10, translatorReq11})
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        // process.exit(1)
    })

// console.log("hi");