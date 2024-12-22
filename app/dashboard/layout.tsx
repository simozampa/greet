"use client";

import { Fragment, useEffect, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import Navigation from "../_components/Navigation";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import ProfilePicture from "../_components/ProfilePicture";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const { data: session, status } = useSession();
  const pathName = usePathname();

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathName]);

  const user = session?.user;
  const role = user?.role?.slug;

  return (
    <>
      <div>
        {/* Mobile sidebar */}
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center">
                      <span className="text-xl font-logo uppercase text-gray-900">
                        {process.env.NEXT_PUBLIC_NAME}
                      </span>
                    </div>
                    <Navigation role={role} pathName={pathName} />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-transparent px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <Link href={user?.role?.slug === 'admin' ? '/dashboard/admin' : '/dashboard'} >
                <span className="text-xl font-logo uppercase text-gray-900">
                  {process.env.NEXT_PUBLIC_NAME}
                </span>
              </Link>
            </div>
            <Navigation role={role} pathName={pathName} />
          </div>
        </div>

        {/* Top Navbar desktop and mobile */}
        <div className="lg:pl-72">
          <div className="relative top-0 z-40 flex h-16 shrink-0 items-center border-b border-gray-200 bg-white shadow-sm px-4 md:px-6 lg:px-8">
            <button
              type="button"
              className="text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Logo */}
            <div className="relative flex w-full justify-center">
              <div className="flex items-center justify-center">
                <Link href="/dashboard">
                  <span className="text-xl lg:hidden font-logo uppercase">
                    {process.env.NEXT_PUBLIC_NAME}
                  </span>
                </Link>
              </div>
            </div>

            {/* Profile dropdown */}
            <div className="flex flex-shrink-0 items-center justify-end">
              <Menu as="div" className="relative">
                <Menu.Button className="-m-1.5 flex items-center p-1.5">
                  <span className="sr-only">Open user menu</span>
                  {status === "authenticated" ? (
                    <div className="relative h-8 w-8 flex-shrink-0 rounded-full bg-gray-100">
                      <ProfilePicture
                        size="2rem"
                        name={user?.name || ""}
                        pictureUrl={undefined}
                      />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                  )}
                  <span className="hidden lg:flex lg:items-center">
                    <span
                      className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                      aria-hidden="true"
                    >
                      {user?.name}
                    </span>
                    <ChevronDownIcon
                      className="ml-2 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                    <Menu.Item>
                      <Link
                        href="/dashboard/profile"
                        className="block px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-50"
                      >
                        Your Profile
                      </Link>
                    </Menu.Item>
                    <Menu.Item>
                      <button
                        onClick={() => signOut()}
                        className="text-left w-full block px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-50"
                      >
                        Sign out
                      </button>
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>

          <div className="relative">
            <main className="py-10">
              <div className="px-4 sm:px-6 lg:px-8">{children}</div>
            </main>
          </div>

        </div>
      </div>
    </>
  );
}
