interface CreatorListingsSkeletonProps {
    items: number
}

export default function CreatorListingsCardSkeleton({ items }: CreatorListingsSkeletonProps) {

    return (
        <div className="animate-pulse">
            <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
                {[...Array(items)].map((_, index) => (
                    <li key={index} className="col-span-1 flex flex-col">
                        <div className="relative rounded-xl overflow-hidden shadow-md h-full flex flex-col">

                            {/* Image Slider */}
                            <div className="">
                                <div className="relative h-48">
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                        <svg className="w-10 h-10 text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Listing Details */}
                            <div className="flex-1 flex flex-col animate-pulse">
                                <div className="px-6 py-4 cursor-pointer flex-1 flex flex-col">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-full h-2 bg-gray-200 rounded-sm" />
                                        <div className="w-20 h-2 ml-2 pl-2 bg-gray-200 border-l border-gray-200 rounded-sm" />
                                    </div>
                                    <div className="w-full h-2 mt-2 bg-gray-200" />
                                    <div className="w-full h-2 mt-2 bg-gray-200" />
                                </div>
                            </div>

                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}