import Link from "next/link"
import Image from "next/image"
import { ListingWithLocation } from "../_utils/db"
import Carousel from "./Carousel";
import { BookingStatus } from "@prisma/client";

interface CreatorListingCardProps {
    listing: ListingWithLocation
    userId: string | undefined
}

export default function CreatorListingCard({ listing, userId }: CreatorListingCardProps) {

    // Find booking already existing for this listing (if any)
    const bookingId = listing.bookings.find((x ) => x.userId === userId  && (x.status === BookingStatus.APPROVED || x.status === BookingStatus.PENDING))?.id;

    return (
        <div className="relative rounded-xl overflow-hidden shadow-md h-full flex flex-col">

            {/* Image Slider */}
            <div className=""> {/* Keep this div to prevent Carousel to break because of flex-col in the parent */}
                <Carousel loop>
                    {listing.images.map((src: string, index: number) => (

                        <div key={index} className="relative h-48 flex-[0_0_100%]">
                            <Image
                                src={src}
                                alt="Listing Image"
                                fill
                                sizes="26rem"
                                className="w-full h-full object-center object-cover"
                            />
                        </div>
                    ))}
                </Carousel>
            </div>


            {/* Listing Details */}
            <Link
                href={bookingId ? `/bookings/${bookingId}` : `/listings/${listing.id}`} className="flex-1 flex flex-col">
                <div className="text-start px-6 py-4 cursor-pointer flex-1 flex flex-col">
                    <div className="">
                        <span className="font-semibold text-gray-900">{listing.business.name}</span>
                        <span className="ml-2 pl-2 text-gray-500 border-l border-gray-200 text-sm">
                            {listing.business.cuisineType}
                        </span>
                    </div>
                    <div className="mt-1 space-x-2">
                        {bookingId &&
                            <span className='inline-flex flex-shrink-0 items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ring-green-600/20 bg-green-50 text-green-700'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3 h-3 mr-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                Applied
                            </span>
                        }
                        {listing.redeemAnytime &&
                            <span className='inline-flex flex-shrink-0 items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ring-creator-600/20 bg-creator-50 text-creator-700'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3 h-3 mr-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Redeem Anytime
                            </span>
                        }
                    </div>

                    <p className="flex-1 mt-1 text-gray-700 font-medium text-sm text-start">
                        {listing.title}
                    </p>
                    <p className="mt-1 text-gray-500 text-sm text-start">
                        {listing.location.street + ", " + listing.location.city}
                    </p>
                </div>
            </Link>

        </div>
    )
}
