"use client";

import { Fragment } from "react";
import { Disclosure, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import PrimaryButton from "./PrimaryButton";
import Link from "next/link";
import { cn } from "../_utils/helpers";
import { usePathname } from "next/navigation";

export default function LandingNavbar() {
    const pathName = usePathname();
    return (
        <Disclosure as="nav" className="sticky inset-x-0 top-0 z-30">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 backdrop-blur-xl bg-white/20">
                        <div className="relative flex h-16 justify-center">
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                {/* Mobile menu button */}
                                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-900 hover:text-gray-500">
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </Disclosure.Button>
                            </div>
                            <Link href='/'>
                                <div
                                    className={cn(
                                        pathName !== '/' && pathName !== '/creators' ? 'left-1/2 -translate-x-1/2'
                                            : 'left-1/2 -translate-x-1/2 sm:left-0',
                                        "absolute inset-y-0 flex items-center"
                                    )}
                                >
                                    <span className="text-xl font-logo uppercase">
                                        {process.env.NEXT_PUBLIC_NAME}
                                    </span>
                                </div>
                            </Link>

                            {(pathName === "/" || pathName === "/creators") && (
                                <>
                                    <div className="flex w-full justify-center items-center">
                                        <div className="hidden sm:flex sm:space-x-8">
                                            <Link
                                                href="/"
                                                className={cn(
                                                    "inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900",
                                                    pathName === "/" ? "text-business-500" : ""
                                                )}
                                            >
                                                For Businesses
                                            </Link>
                                            <Link
                                                href="/creators"
                                                className={cn(
                                                    "inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900",
                                                    pathName === "/creators" ? "text-creator-500" : ""
                                                )}
                                            >
                                                For Creators
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="hidden sm:flex sm:justify-end sm:absolute inset-y-0 right-0 items-center pr-2 sm:ml-6 sm:pr-0">
                                        {/* Sign in Button */}
                                        <Link
                                            href="/login"
                                            className="text-gray-900 font-semibold text-sm mr-4"
                                        >
                                            Sign In
                                        </Link>
                                        {/* Get Started Button */}
                                        <Link
                                            href={
                                                pathName === "/"
                                                    ? "/register/businesses"
                                                    : pathName === "/creators"
                                                        ? "/register/creators"
                                                        : "/"
                                            }
                                        >
                                            <PrimaryButton
                                                className={cn(
                                                    "text-sm",
                                                    pathName === "/"
                                                        ? "bg-business-500 hover:bg-business-400"
                                                        : pathName === "/creators"
                                                            ? "bg-creator-500 hover:bg-creator-400"
                                                            : ""
                                                )}
                                            >
                                                Get Started
                                            </PrimaryButton>
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>

                        <hr
                            className={cn(
                                pathName === "/"
                                    ? "via-business-500/30"
                                    : pathName === "/creators"
                                        ? "via-creator-500/30"
                                        : "via-gray-900/20",
                                "h-px bg-gradient-to-r from-transparent to-transparent border-0"
                            )}
                        />
                    </div>

                    {/* Mobile Menu */}
                    <Transition.Root show={open} as={Fragment}>
                        <Transition.Child
                            as={Fragment}
                            enter="transition-all ease-in-out duration-200"
                            enterFrom="h-0"
                            enterTo="h-[24rem]"
                            leave="transition-all ease-out duration-100 delay-100"
                            leaveFrom="h-[24rem]"
                            leaveTo="h-0"
                        >
                            <Disclosure.Panel className="sm:hidden absolute bg-white backdrop-blur-lg w-full">
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
                                            href="/"
                                            className={cn(
                                                "block py-2 font-medium text-gray-900",
                                                pathName === "/"
                                                    ? "text-business-500"
                                                    : "hover:border-gray-300 hover:text-gray-700"
                                            )}
                                        >
                                            For Businesses
                                        </Disclosure.Button>
                                        <Disclosure.Button
                                            as="a"
                                            href="/creators"
                                            className={cn(
                                                "block py-2 font-medium text-gray-900",
                                                pathName === "/creators"
                                                    ? "text-creator-500"
                                                    : "hover:border-gray-300 hover:text-gray-900"
                                            )}
                                        >
                                            For Creators
                                        </Disclosure.Button>
                                        <div className="pt-36">
                                            <Disclosure.Button
                                                as="a"
                                                href="/login"
                                                className="block py-4 font-medium text-gray-900 hover:border-gray-300 hover:text-gray-700"
                                            >
                                                Sign In
                                            </Disclosure.Button>
                                        </div>

                                        <Disclosure.Button
                                            as="a"
                                            href={
                                                pathName === "/"
                                                    ? "/register/businesses"
                                                    : pathName === "/creators"
                                                        ? "/register/creators"
                                                        : "/"
                                            }
                                            className="block px-4"
                                        >
                                            <PrimaryButton
                                                className={cn(
                                                    "w-full rounded-xl",
                                                    pathName === "/"
                                                        ? "bg-business-500 hover:bg-business-400"
                                                        : pathName === "/creators"
                                                            ? "bg-creator-500 hover:bg-creator-400"
                                                            : ""
                                                )}
                                            >
                                                Get Started
                                            </PrimaryButton>
                                        </Disclosure.Button>
                                    </div>
                                </Transition.Child>
                            </Disclosure.Panel>
                        </Transition.Child>
                    </Transition.Root>
                </>
            )}
        </Disclosure>
    );
}
