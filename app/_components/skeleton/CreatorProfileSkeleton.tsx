interface CreatorProfileSkeletonProps {
}

export default function CreatorProfileSkeleton({ }: CreatorProfileSkeletonProps) {
    return (
        <div className="space-y-12">

            {/* Edit Profile Info */}
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
                <div className="md:col-span-1">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        Edit here your personal information.
                    </p>
                </div>

                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2 animate-pulse">

                    <div className="col-span-full " >
                        <div className="h-4 w-10 bg-gray-200 rounded-sm" />
                        <div className="mt-1">
                            <div className="h-8 w-full bg-gray-200 rounded-sm" />
                        </div>
                    </div>

                    <div className="col-span-full ">
                        <div className="h-4 w-10 bg-gray-200 rounded-sm" />
                        <div className="mt-1">
                            <div className="h-8 w-full bg-gray-200 rounded-sm" />
                        </div>
                    </div>

                    <div className="col-span-full sm:col-span-3 ">
                        <div className="h-4 w-10 bg-gray-200 rounded-sm" />
                        <div className="mt-1">
                            <div className="h-8 w-full bg-gray-200 rounded-sm" />
                        </div>
                    </div>

                    <div className="col-span-full sm:col-span-3 ">
                        <div className="h-4 w-10 bg-gray-200 rounded-sm" />
                        <div className="mt-1">
                            <div className="h-8 w-full bg-gray-200 rounded-sm" />
                        </div>
                    </div>

                    <div className="col-span-full sm:col-span-3 ">
                        <div className="h-4 w-10 bg-gray-200 rounded-sm" />
                        <div className="mt-1">
                            <div className="h-8 w-full bg-gray-200 rounded-sm" />
                        </div>
                    </div>

                    <div className="col-span-full sm:col-span-3 ">
                        <div className="h-4 w-10 bg-gray-200 rounded-sm" />
                        <div className="mt-1">
                            <div className="h-8 w-full bg-gray-200 rounded-sm" />
                        </div>
                    </div>

                    <div className="col-span-full sm:col-span-3 ">
                        <div className="h-4 w-10 bg-gray-200 rounded-sm" />
                        <div className="mt-1">
                            <div className="h-8 w-full bg-gray-200 rounded-sm" />
                        </div>
                    </div>

                    <div className="col-span-full sm:col-span-3 ">
                        <div className="h-4 w-10 bg-gray-200 rounded-sm" />
                        <div className="mt-1">
                            <div className="h-8 w-full bg-gray-200 rounded-sm" />
                        </div>
                    </div>

                    <div className=" col-span-full py-6 flex items-center justify-end gap-x-6 border-b border-gray-900/10">
                        <div className="w-16 h-8 rounded-md bg-gray-300" />
                    </div>
                </div>
            </div>

            {/* MISSING CONNECT SOCIALS HERE */}

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
                <div>
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Change Password</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">Update the password for your account.</p>
                </div>

                <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2 animate-pulse">

                    {/* Old Password */}
                    < div className="col-span-full" >
                        <div className="h-4 w-10 bg-gray-200 rounded-sm" />
                        <div className="mt-1">
                            <div className="h-8 w-full bg-gray-200 rounded-sm" />
                        </div>
                    </div >

                    <div className="col-span-full" >
                        <div className="h-4 w-10 bg-gray-200 rounded-sm" />
                        <div className="mt-1">
                            <div className="h-8 w-full bg-gray-200 rounded-sm" />
                        </div>
                    </div >

                    {/* Confirm Password */}
                    < div className="col-span-full" >
                        <div className="h-4 w-10 bg-gray-200 rounded-sm" />
                        <div className="mt-1">
                            <div className="h-8 w-full bg-gray-200 rounded-sm" />
                        </div>
                    </div >

                    <div className="col-span-full py-6 flex items-center justify-end gap-x-6 border-b border-gray-900/10">
                        <div className="w-16 h-8 rounded-md bg-gray-300" />
                    </div>
                </div>


            </div>
        </div>
    )
}