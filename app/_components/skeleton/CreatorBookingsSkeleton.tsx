interface CreatorBookingsCardSkeletonProps {
    items: number
}

export default function CreatorBookingsSkeleton({ items }: CreatorBookingsCardSkeletonProps) {

    return (
        <div className="animate-pulse">

            <div className="border-b border-gray-200 pb-5 sm:pb-0 mb-4 sm:mb-8">
                <div className="sm:hidden">
                    <div className="h-8 w-full rounded-md bg-gray-200 py-2 pl-3 pr-10" />
                </div>
                <div className="hidden sm:block">
                    <nav className="-mb-px flex space-x-8">
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className='whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium'
                            >
                                <div key={index} className="w-16 h-4 bg-gray-200 rounded-md" />
                            </div>
                        ))}
                    </nav>
                </div>
            </div>

            <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
                {[...Array(items)].map((_, index) => (
                    <li key={index} className="col-span-1">
                        <div className="rounded-lg bg-white shadow-md ring-1 ring-gray-200 cursor-pointer p-4 h-full flex flex-col">
                            <div className="flex w-full items-start justify-between">
                                <div className="w-full flex items-start space-x-2">
                                    <div className="relative h-12 w-12 flex-shrink-0 rounded-full bg-gray-200">
                                        <svg className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                                        </svg>
                                    </div>
                                    <div className="w-1/2">
                                        <div className="w-full h-4 bg-gray-300 rounded-sm" />
                                        <div className="mt-2 w-10 h-4 bg-gray-200 rounded-sm" />
                                    </div>
                                </div>
                            </div>
                            <span className="w-full h-2 rounded-md mt-4 bg-gray-200" />
                            <span className="bg-gray-200 h-2 w-full" />
                            <div className="mt-4 flex items-center space-x-2">
                                <span className="h-5 w-20 mt-1 inline-flex flex-shrink-0 rounded-md px-2 py-0.5 ring-1 ring-inset bg-gray-100 ring-gray-200" />
                                <span className="w-full h-5 mt-1 bg-gray-100 rounded-sm" />
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}