import { Prisma, PrismaClient } from "@prisma/client"

declare global {
    // eslint-disable-next-line no-var
    var cachedPrisma: PrismaClient
}

let prisma: PrismaClient
if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient()
} else {
    if (!global.cachedPrisma) {
        global.cachedPrisma = new PrismaClient()
    }
    prisma = global.cachedPrisma
}

export const db = prisma


const businessWithRelations = Prisma.validator<Prisma.BusinessArgs>()({
    include: {
        locations: true,
        listings: true,
        bookings: true,
        users: true,
    },
})

export type BusinessWithRelations = Prisma.BusinessGetPayload<typeof businessWithRelations>;


const listingWithLocation = Prisma.validator<Prisma.ListingArgs>()({
    include: {
        location: true,
        business: true,
        bookings: {
            include: {
                user: true
            }
        },
    },
})

export type ListingWithLocation = Prisma.ListingGetPayload<typeof listingWithLocation>;

// Booking with every relation in the DB
const bookingWithRelations = Prisma.validator<Prisma.BookingArgs>()({
    include: {
        listing: {
            include: {
                location: true,
            }
        },
        business: true,
        user: {
            include: {
                instagramAccount: true
            }
        }
    },
})
export type BookingWithRelations = Prisma.BookingGetPayload<typeof bookingWithRelations>;

const userWithRelations = Prisma.validator<Prisma.UserArgs>()({
    include: {
        instagramAccount: true,
        bookings: true,
    },
})
export type UserWithRelations = Prisma.UserGetPayload<typeof userWithRelations>;

const mediaWithRelations = Prisma.validator<Prisma.MediaObjectArgs>()({
    include: {
        user: {
            include: {
                instagramAccount: true
            }
        },
    },
})
export type MediaWithRelations = Prisma.MediaObjectGetPayload<typeof mediaWithRelations>;