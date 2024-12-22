'use client'

import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { cn } from '../_utils/helpers'
import { usePathname } from 'next/navigation'
import { User } from 'next-auth'
import ProfilePicture from './ProfilePicture'

export default function Navbar() {
    const { data: session, status } = useSession();
    const user: User | undefined = session?.user;

    const pathName = usePathname();

    const logout = () => {
        signOut();
    } 

    return (
        <Disclosure as="nav" className="relative inset-x-0 top-0 z-30">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 backdrop-blur-xl bg-white/20">
                        <div className="relative flex h-16 justify-center">
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                {/* Mobile menu button */}
                                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-800 hover:text-gray-700">
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </Disclosure.Button>
                            </div>
                            <Link href="/listings" className="flex absolute items-center justify-center inset-y-0 flex-shrink-0 sm:left-0">
                                <span className='text-xl font-logo uppercase'>{process.env.NEXT_PUBLIC_NAME}</span>
                            </Link>
                            <div className="flex w-full justify-center items-center sm:items-stretch">
                                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                    <Link
                                        href='/listings'
                                        className={cn("inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900",
                                            pathName.match(new RegExp('/listings')) && "text-creator-500")}
                                    >
                                        Explore
                                    </Link>
                                    <Link
                                        href='/bookings'
                                        className={cn("inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900",
                                            pathName.match(new RegExp('/bookings')) && "text-creator-500")}
                                    >
                                        Bookings
                                    </Link>
                                    <Link
                                        href='/profile'
                                        className={cn("inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900",
                                            pathName.match(new RegExp('/profile')) && 'text-creator-500')}
                                    >
                                        Profile
                                    </Link>
                                </div>
                            </div>

                            <div className="flex justify-end absolute inset-y-0 right-0 items-center pr-2">

                                {/* Profile dropdown */}
                                <Menu as="div" className="relative ml-3">
                                    {status === 'authenticated' && user?.role?.slug === 'creator' && (
                                        <div>
                                            <Menu.Button className="flex rounded-full bg-white text-sm ">
                                                <span className="sr-only">Open user menu</span>
                                                <div className="relative w-10 h-10 flex-shrink-0 rounded-full bg-gray-100">
                                                    <ProfilePicture
                                                        size="2.5rem"
                                                        pictureUrl={user.instagramAccount?.profilePictureUrl}
                                                        name={user?.name || ""}
                                                    />
                                                </div>
                                            </Menu.Button>
                                        </div>
                                    )}
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-200"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <Menu.Item>
                                                <a
                                                    href="/profile"
                                                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                                                >
                                                    Your Profile
                                                </a>
                                            </Menu.Item>
                                            <Menu.Item>
                                                <button
                                                    onClick={() => logout()}
                                                    className='w-full flex justify-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                                                >
                                                    Sign out
                                                </button>
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>
                    </div>

                    <hr className="h-px bg-gradient-to-r from-transparent via-creator-500/50 to-transparent border-0" />

                    {/* Mobile Menu */}
                    <Transition.Root show={open} as={Fragment}>
                        <Transition.Child
                            as={Fragment}
                            enter="transition-all ease-in-out duration-200"
                            enterFrom="h-0"
                            enterTo="h-64"
                            leave="transition-all ease-out duration-100 delay-100"
                            leaveFrom="h-64"
                            leaveTo="h-0"
                        >
                            <Disclosure.Panel className="sm:hidden absolute z-30 bg-white backdrop-blur-lg w-full transition-all duration-300">
                                <Transition.Child

                                    enter="transition ease-in duration-100 delay-200"
                                    enterFrom="opacity-0 -translate-y-8"
                                    enterTo="opacity-100 translate-y-0"
                                    leave="transition ease-out duration-100"
                                    leaveFrom="opacity-100 translate-y-0"
                                    leaveTo="opacity-0 -translate-y-8"
                                >

                                    <div className="space-y-1 pb-4 pt-2 text-center">
                                        <Disclosure.Button
                                            as="a"
                                            href="/listings"
                                            className={cn(
                                                "block py-2 font-medium text-gray-700",
                                                pathName.match(new RegExp('/listings')) ? 'text-creator-500 border-creator-500'
                                                    : 'hover:border-gray-300 hover:text-gray-700')}
                                        >
                                            Explore
                                        </Disclosure.Button>
                                        <Disclosure.Button
                                            as="a"
                                            href="/bookings"
                                            className={cn(
                                                "block py-2 font-medium text-gray-900",
                                                pathName.match(new RegExp('/bookings')) ? 'text-creator-500 border-creator-500'
                                                    : 'hover:border-gray-300 hover:text-gray-700')}
                                        >
                                            Bookings
                                        </Disclosure.Button>
                                        <Disclosure.Button
                                            as="a"
                                            href="/profile"
                                            className={cn(
                                                "block py-2 font-medium text-gray-900",
                                                pathName.match(new RegExp('/profile')) ? 'text-creator-500'
                                                    : 'hover:border-gray-300 hover:text-gray-700')}
                                        >
                                            Profile
                                        </Disclosure.Button>
                                        <div className='pt-8'>
                                            <Disclosure.Button
                                                as="button"
                                                onClick={() => logout()}
                                                className="block w-full text-center font-medium py-4 text-gray-800 hover:border-gray-300 hover:text-gray-500"
                                            >
                                                Sign out
                                            </Disclosure.Button>
                                        </div>
                                    </div>
                                </Transition.Child>
                            </Disclosure.Panel>
                        </Transition.Child>
                    </Transition.Root>
                </>
            )}
        </Disclosure>
    )

}