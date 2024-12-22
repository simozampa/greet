interface CreatorBookingSkeletonProps {

}

export default function CreatorBookingSkeleton({ }: CreatorBookingSkeletonProps) {
    return (
        <div className="max-w-2xl mx-auto lg:mx-0 lg:max-w-none animate-pulse">

            <div>
                <div className="px-4 sm:px-0">
                    <div className="flex items-center space-x-4">
                        <div className="h-8 w-32 bg-gray-300 rounded-sm" />
                        <span className="h-5 w-20 inline-flex flex-shrink-0 rounded-md px-2 py-0.5 ring-1 ring-inset bg-gray-100 ring-gray-200" />
                    </div>
                    <div className="mt-4 w-full h-4 bg-gray-300 rounded-sm sm:mt-2" />

                </div>
                <div className="mt-6">
                    <dl className="grid grid-cols-1 sm:grid-cols-2">
                        <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                            <div className="w-1/2 h-4 bg-gray-300 rounded-sm" />
                            <div className="mt-4 w-full h-4 bg-gray-300 rounded-sm sm:mt-2" />
                        </div>
                        <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                            <div className="w-1/2 h-4 bg-gray-300 rounded-sm" />
                            <div className="mt-4 w-full h-4 bg-gray-300 rounded-sm sm:mt-2" />
                        </div>
                        <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                            <div className="w-1/2 h-4 bg-gray-300 rounded-sm" />
                            <div className="mt-4 w-full h-4 bg-gray-300 rounded-sm sm:mt-2" />
                            <div className="mt-2 sm:w-3/4 h-4 bg-gray-300 rounded-sm sm:mt-2" />
                        </div>
                        <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                            <div className="w-1/2 h-4 bg-gray-300 rounded-sm" />
                            <div className="mt-4 w-full h-4 bg-gray-300 rounded-sm sm:mt-2" />
                        </div>
                        <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                            <div className="w-1/2 h-4 bg-gray-300 rounded-sm" />
                            <div className="mt-4 w-full h-4 bg-gray-300 rounded-sm sm:mt-2" />
                        </div>
                        <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                            <div className="w-1/2 h-4 bg-gray-300 rounded-sm" />
                            <div className="mt-4 w-full h-4 bg-gray-300 rounded-sm sm:mt-2" />
                        </div>
                    </dl>
                </div>
            </div >

            <div className="mt-4 h-8 w-full sm:w-32 bg-gray-300 rounded-md" />

        </div>
    )
}