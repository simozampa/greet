'use client'

import { cn } from "@/app/_utils/helpers"
import { ApprovalStatus, BookingStatus } from "@prisma/client"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface StatusFilterProps {
    tabs: { name: string, status: BookingStatus | ApprovalStatus | undefined }[]
    selected: string | undefined
    path: string
}

export default function StatusFilter({ selected, path, tabs }: StatusFilterProps) {

    const router = useRouter();

    function buildUrlStatus(status: BookingStatus | undefined) {
        const baseUrl = `${process.env.NEXT_PUBLIC_URL}/${path}`;
        if (status === undefined) return baseUrl;

        const url = new URL(baseUrl);
        const params = new URLSearchParams();
        params.append("status", status);
        url.search = params.toString();
        return url.toString();
    };

    return (
        <div className="border-b border-gray-200 pb-5 sm:pb-0 mb-4 sm:mb-8">
            <div className="sm:hidden">
                <label htmlFor="current-tab" className="sr-only">
                    Select a tab
                </label>
                <select
                    id="current-tab"
                    name="current-tab"
                    className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm"
                    defaultValue={selected}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        e.target.value === 'All' ? router.push(buildUrlStatus(undefined)) : router.push(buildUrlStatus(e.target.value as BookingStatus))
                    }}
                >
                    {tabs.map((tab) => (
                        <option
                            key={tab.name}
                            value={tab.status}
                        >
                            {tab.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="hidden sm:block">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.name}
                            href={buildUrlStatus(tab.status)}
                            className={cn(
                                (selected === tab.status)
                                    ? 'border-gray-900 text-gray-900'
                                    : selected === tab.status && path === 'dashboard/bookings'
                                        ? 'border-business-500 text-business-500'
                                        : selected === tab.status && path === '/bookings'
                                            ? 'border-creator-500 text-creator-600'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                'whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium'
                            )}
                            aria-current={selected ? 'page' : undefined}
                        >
                            {tab.name}
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    )
}