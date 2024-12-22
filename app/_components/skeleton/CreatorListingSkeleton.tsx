interface CreatorListingsSkeletonProps {
}

export default function CreatorListingsCardSkeleton({ }: CreatorListingsSkeletonProps) {
    return (
        <div className="mx-auto max-w-2xl lg:max-w-none lg:mx-0">
            <div className="grid grid-cols-1 items-start gap-x-8 gap-y-8 sm:gap-y-16 lg:grid-cols-2">
                {/* Listing Details */}
                <div>
                    <div className="h-4 w-12 flex bg-gray-200 rounded-sm" />
                    <div className="mt-1 h-8 w-full bg-gray-300 rounded-sm" />
                    <div className="mt-1 h-4 w-full bg-gray-200 rounded-sm" />
                    <h1 className="mt-4 h-6 w-full font-semibold bg-gray-300 rounded-sm" />
                    <div className="max-w-xl">
                        <div className="mt-1 h-4 w-full bg-gray-200 rounded-sm" />
                    </div>
                    <div className="mt-4">
                        <div className="h-4 bg-gray-200 w-12 rounded-sm" />
                        <div className="mt-1 h-4 w-full bg-gray-200 rounded-sm" />
                    </div>
                </div>

                {/* Image Slider */}
                <div className="lg:order-first lg:pr-4">
                    <div className="relative h-96 bg-gray-200 rounded-xl">
                        <svg className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-12 h-12 text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Separator */}
            <div className="my-8 w-full border-b border-gray-200" />
        </div>
    );
}
