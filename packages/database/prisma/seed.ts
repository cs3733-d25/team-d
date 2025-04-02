import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
    const translatorReq1 = await prisma.translatorRequest.upsert({
        where: {requestId: 1},
        update: {},
        create: {
            languageFrom: 'Vietnamese',
            languageTo: 'English',
            roomNumber: '302',
            startDateTime: '2025-04-01T22:07:00.639Z',
            endDateTime: '2025-04-01T22:07:45.639Z'
        }
    })

    const translatorReq2 = await prisma.translatorRequest.upsert({
        where: {requestId: 2},
        update: {},
        create: {
            languageFrom: 'Spanish',
            languageTo: 'English',
            roomNumber: '207',
            startDateTime: '2025-04-11T22:04:30.639Z',
            endDateTime: '2025-04-11T22:05:00.639Z',
            assignedEmployeeId: 1
        },
    })

    const translatorReq3 = await prisma.translatorRequest.upsert({
        where: {requestId: 3},
        update: {},
        create: {
            languageFrom: 'English',
            languageTo: 'Portuguese',
            roomNumber: '119',
            startDateTime: '2025-04-18T22:05:00.639Z',
            endDateTime: '2025-04-18T22:05:40.639Z',
            assignedEmployeeId: 2
        },
    })

    const translatorReq4 = await prisma.translatorRequest.upsert({
        where: {requestId: 4},
        update: {},
        create: {
            languageFrom: 'Chinese',
            languageTo: 'English',
            roomNumber: '222',
            startDateTime: '2025-04-02T22:01:15.639Z',
            endDateTime: '2025-04-02T22:02:00.639Z',
        },
    })

    const translatorReq5 = await prisma.translatorRequest.upsert({
        where: {requestId: 5},
        update: {},
        create: {
            languageFrom: 'English',
            languageTo: 'Vietnamese',
            roomNumber: '129',
            startDateTime: '2025-05-27T22:09:00.639Z',
            endDateTime: '2025-05-27T22:09:45.639Z',
        },
    })

    const translatorReq6 = await prisma.translatorRequest.upsert({
        where: {requestId: 6},
        update: {},
        create: {
            languageFrom: 'German',
            languageTo: 'Spanish',
            roomNumber: '311',
            startDateTime: '2025-04-15T22:09:20.639Z',
            endDateTime: '2025-04-15T22:08:45.639Z',
        },
    })

    const translatorReq7 = await prisma.translatorRequest.upsert({
        where: {requestId: 7},
        update: {},
        create: {
            languageFrom: 'Korean',
            languageTo: 'English',
            roomNumber: '104',
            startDateTime: '2025-06-01T22:02:30.639Z',
            endDateTime: '2025-06-01T22:03:30.639Z',
        },
    })

    const translatorReq8 = await prisma.translatorRequest.upsert({
        where: {requestId: 8},
        update: {},
        create: {
            languageFrom: 'English',
            languageTo: 'Russian',
            roomNumber: '333',
            startDateTime: '2025-05-11T22:04:00.639Z',
            endDateTime: '2025-05-11T22:04:45.639Z',
            employeeId: 3
        },
    })

    const translatorReq9 = await prisma.translatorRequest.upsert({
        where: {requestId: 9},
        update: {},
        create: {
            languageFrom: 'French',
            languageTo: 'English',
            roomNumber: '234',
            startDateTime: '2025-04-28T22:07:00.639Z',
            endDateTime: '2025-04-28T22:07:45.639Z',
            employeeId: 4
        },
    })

    const translatorReq10 = await prisma.translatorRequest.upsert({
        where: {requestId: 10},
        update: {},
        create: {
            languageFrom: 'English',
            languageTo: 'Chinese',
            roomNumber: '232',
            startDateTime: '2025-05-29T22:09:00.639Z',
            endDateTime: '2025-05-29T22:10:30.639Z',
            employeeId: 5
        },
    })

    const translatorReq11 = await prisma.translatorRequest.upsert({
        where: {requestId: 11},
        update: {},
        create: {
            languageFrom: 'Spanish',
            languageTo: 'French',
            roomNumber: '119',
            startDateTime: '2025-06-20T22:10:30.639Z',
            endDateTime: '2025-06-20T22:11:15.639Z',
        },
    })

    console.log({ translatorReq1, translatorReq2, translatorReq3, translatorReq4, translatorReq5, translatorReq6,translatorReq7,translatorReq8,
        translatorReq9, translatorReq10, translatorReq11})
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

// console.log("hi");