import {
    Cog6ToothIcon,
    FolderIcon,
    HomeIcon,
    UsersIcon,
    BuildingOfficeIcon,
    InboxIcon,
    ListBulletIcon,
    PhotoIcon
} from '@heroicons/react/24/outline'
import { cn } from '../_utils/helpers'
import Link from 'next/link'

interface NavigationProps {
    role: string | undefined
    pathName: string
}

export const adminNavigation = [
    { name: 'Dashboard', href: '/dashboard/admin', icon: HomeIcon },
    { name: 'Creators', href: '/dashboard/creators', icon: UsersIcon },
    { name: 'Businesses', href: '/dashboard/businesses', icon: FolderIcon },
    { name: 'Upload Media', href: '/dashboard/upload-media', icon: PhotoIcon },
    { name: 'All Bookings', href: '/dashboard/all-bookings', icon: ListBulletIcon },
]

export const businessNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Content', href: '/dashboard/content', icon: PhotoIcon },
    { name: 'Business Profile', href: '/dashboard/business-profile', icon: BuildingOfficeIcon },
    { name: 'Bookings', href: '/dashboard/bookings', icon: InboxIcon },
    { name: 'Listings', href: '/dashboard/listings', icon: ListBulletIcon },
]

export default function Navigation({ role, pathName }: NavigationProps) {

    return (
        <>
            <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                        <ul role="list" className="-mx-2 space-y-1">
                            {role === 'admin' &&
                                adminNavigation.map((item) => (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                pathName == item.href
                                                    ? 'bg-gray-50 text-business-500'
                                                    : 'text-gray-700 hover:text-business-500 hover:bg-gray-50',
                                                'w-full group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                            )}
                                        >
                                            <item.icon
                                                className={cn(
                                                    pathName == item.href ? 'text-business-500' : 'text-gray-400 group-hover:text-business-500',
                                                    'h-6 w-6 shrink-0'
                                                )}
                                                aria-hidden="true"
                                            />
                                            {item.name}
                                        </Link>
                                    </li>
                                ))
                            }
                            {role === 'business-owner' &&
                                businessNavigation.map((item) => (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                (pathName.match(new RegExp(item.href)) && item.href !== '/dashboard') || item.href === pathName
                                                    ? 'bg-gray-50 text-business-500'
                                                    : 'text-gray-700 hover:text-business-500 hover:bg-gray-50',
                                                'w-full group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                            )}
                                        >
                                            <item.icon
                                                className={cn(
                                                    (pathName.match(new RegExp(item.href)) && item.href !== '/dashboard') || item.href === pathName ? 'text-business-500' : 'text-gray-400 group-hover:text-business-500',
                                                    'h-6 w-6 shrink-0'
                                                )}
                                                aria-hidden="true"
                                            />
                                            {item.name}
                                        </Link>
                                    </li>
                                ))
                            }
                        </ul>
                    </li>
                    <li className="mt-auto">
                        <a
                            href="/dashboard/contact-us"
                            className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-business-500"
                        >
                            <Cog6ToothIcon
                                className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-business-500"
                                aria-hidden="true"
                            />
                            Support
                        </a>
                    </li>
                </ul>
            </nav>
        </>
    )
}