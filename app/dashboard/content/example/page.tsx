'use client'

import Image from "next/image";
import { ArrowDownTrayIcon, LinkIcon, VideoCameraIcon, XMarkIcon } from "@heroicons/react/24/outline";
import ProfilePicture from "@/app/_components/ProfilePicture";
import { MediaType } from "@prisma/client";
import Link from "next/link";
import { getConentTypeBage } from "@/app/_utils/helpers";
import { useState } from "react";
import Modal from "@/app/_components/Modal";
import SecondaryButton from "@/app/_components/SecondaryButton";

export default function Page() {

    let [openExample1, setOpenExample1] = useState(false)
    let [openExample2, setOpenExample2] = useState(false)
    let [openExample3, setOpenExample3] = useState(false)



    return (
        <>
            {/* Modal Example 1 */}
            <Modal show={openExample1} onClose={() => setOpenExample1(false)} >
                <div className="rounded-lg overflow-scroll-y bg-white p-4 max-w-sm text-left shadow-xl w-full sm:p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-semibold leading-6 text-gray-900">
                            Media Preview
                        </h3>
                        <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                            onClick={() => setOpenExample1(false)}
                        >
                            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="mt-4">
                        <video autoPlay controls width="100%" height="100%" className="aspect-[9/16] rounded-md">
                            <source src="https://cdn-greet.s3.amazonaws.com/1696189560702.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <div className="mt-5 sm:mt-6">
                        <a download href="https://cdn-greet.s3.amazonaws.com/1696189560702.mp4">
                            <SecondaryButton className="space-x-2 w-full">
                                <ArrowDownTrayIcon className="h-5 w-5 text-gray-800 hover:text-gray-500" aria-hidden="true" />
                                <span>Download Media</span>
                            </SecondaryButton>
                        </a>
                    </div>
                </div>
            </Modal>

            {/* Modal Example 2 */}
            <Modal show={openExample2} onClose={() => setOpenExample2(false)} >
                <div className="rounded-lg overflow-scroll-y bg-white p-4 max-w-sm text-left shadow-xl w-full sm:p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-semibold leading-6 text-gray-900">
                            Media Preview
                        </h3>
                        <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                            onClick={() => setOpenExample2(false)}
                        >
                            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="mt-4">
                        <video autoPlay controls width="100%" height="100%" className="aspect-[9/16] rounded-md">
                            <source src="https://cdn-greet.s3.amazonaws.com/1696189073431.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <div className="mt-5 sm:mt-6">
                        <a download href="https://cdn-greet.s3.amazonaws.com/1696189073431.mp4">
                            <SecondaryButton className="space-x-2 w-full">
                                <ArrowDownTrayIcon className="h-5 w-5 text-gray-800 hover:text-gray-500" aria-hidden="true" />
                                <span>Download Media</span>
                            </SecondaryButton>
                        </a>
                    </div>
                </div>
            </Modal>

            {/* Modal Example 3 */}
            <Modal show={openExample3} onClose={() => setOpenExample3(false)} >
                <div className="rounded-lg overflow-scroll-y bg-white p-4 max-w-sm text-left shadow-xl w-full sm:p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-semibold leading-6 text-gray-900">
                            Media Preview
                        </h3>
                        <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                            onClick={() => setOpenExample3(false)}
                        >
                            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="mt-4">
                        <video autoPlay controls width="100%" height="100%" className="aspect-[9/16] rounded-md">
                            <source src="https://cdn-greet.s3.amazonaws.com/1696189560702.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <div className="mt-5 sm:mt-6">
                        <a download href="https://cdn-greet.s3.amazonaws.com/1696189560702.mp4">
                            <SecondaryButton className="space-x-2 w-full">
                                <ArrowDownTrayIcon className="h-5 w-5 text-gray-800 hover:text-gray-500" aria-hidden="true" />
                                <span>Download Media</span>
                            </SecondaryButton>
                        </a>
                    </div>
                </div>
            </Modal>

            <div className="border-b border-gray-200 pb-5 mb-5">
                <div className="sm:flex sm:items-start sm:justify-between">
                    <div>
                        <h3 className="text-base font-semibold leading-6 text-gray-900">Example Content</h3>
                        <p className="mt-2 max-w-4xl text-sm text-gray-500">
                            This page displays an example of content that your business will receive from creators.
                        </p>
                    </div>
                    <div className="mt-3 sm:ml-4 sm:mt-0">
                        <Link
                            href="/dashboard/content"
                            className="flex items-center justify-center text-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-business-500 shadow-sm ring-1 ring-inset ring-business-500 hover:bg-business-500 hover:text-white"
                        >
                            Hide example
                        </Link>
                    </div>
                </div>
            </div>

            <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">

                {/* Example 1 */}
                <li className="col-span-1 flex flex-col">
                    <div className="relative rounded-xl overflow-hidden shadow-md h-full flex flex-col">

                        {/* Content Thumbnail */}
                        <div onClick={() => setOpenExample1(true)} className="cursor-pointer">
                            <div className="relative h-[360px] group">
                                <Image
                                    src={"https://cdn-greet.s3.amazonaws.com/1696187683336.jpeg"}
                                    alt="Content image"
                                    fill
                                    className="w-full h-full object-cover"
                                />
                                <div className="hidden group-hover:flex absolute bg-gray-200 bg-opacity-75 transition-opacity ease-in duration-200 w-full h-full items-center justify-center">
                                    <p className="text-gray-900 font-semibold">Preview Media</p>
                                </div>
                                <div className="absolute top-0 right-0 m-3 rounded-full bg-business-500 h-8 w-8 flex items-center justify-center">
                                    <VideoCameraIcon className="h-4 w-4 text-business-50" />
                                </div>
                            </div>
                        </div>

                        {/* Content Details */}
                        <div className="flex-1 flex flex-col">
                            <div className="text-start px-6 py-4 flex-1 flex flex-col">
                                <div className="flex items-center space-x-2">
                                    <div className="relative h-12 w-12 flex-shrink-0 rounded-full bg-gray-100">
                                        <ProfilePicture
                                            size="3rem"
                                            pictureUrl="https://cdn-greet.s3.amazonaws.com/1696188193842.jpg"
                                            name="Kristie Hang | LA based host & journalist"
                                        />
                                    </div>
                                    <div className="w-full">
                                        <div className="flex items-center justify-between text-sm leading-6">
                                            <div className="flex w-0 flex-1 items-center">
                                                <p className="font-semibold text-gray-900 truncate flex-shrink">Kristie Hang | LA based host & journalist</p>
                                            </div>
                                            <div className="flex-shrink-0 ml-2 flex justify-end text-sm leading-6 text-gray-700">
                                                {getConentTypeBage(MediaType.REEL)}
                                            </div>
                                        </div>
                                        <a target="_blank" href={`https://www.instagram.com/kristiehang`} className="text-gray-500 text-sm font-medium underline hover:text-gray-700">
                                            @kristiehang
                                        </a>
                                    </div>
                                </div>

                                <p className="flex-1 mt-2 text-gray-700 font-medium text-sm text-start">
                                    Fresh bread 🥖

                                    Oh la la Bakery
                                    📍921 E Colorado Blvd,
                                    Pasadena, CA, 91106

                                    #sgv #pasadena #laeats
                                </p>

                                <div className="flex items-center justify-between">

                                    <div className="mt-2 flex items-center space-x-4">

                                        <div>
                                            <p className="font-semibold text-sm text-gray-900">3.6K</p>
                                            <p className="text-sm text-gray-500 truncate">Engagement</p>
                                        </div>

                                        <div>
                                            <p className="font-semibold text-sm text-gray-900">8.5k</p>
                                            <p className="text-sm text-gray-500">Reach</p>
                                        </div>

                                        <div>
                                            <p className="font-semibold text-sm text-gray-900">2.8k</p>
                                            <p className="text-sm text-gray-500">Likes</p>
                                        </div>


                                        <div>
                                            <p className="font-semibold text-sm text-gray-900">62</p>
                                            <p className="text-sm text-gray-500">Comments</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <a download href={'https://cdn-greet.s3.amazonaws.com/1696187688061.mp4'} className="cursor-pointer">
                                            <ArrowDownTrayIcon className="h-5 w-5 text-gray-800 hover:text-gray-500" aria-hidden="true" />
                                        </a>
                                        <a target="_blank" href={'https://www.instagram.com/p/CwVOYpStzIb/'} className="cursor-pointer">
                                            <LinkIcon className="h-5 w-5 text-gray-800 hover:text-gray-500" aria-hidden="true" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>

                {/* Example 2 */}
                <li className="col-span-1 flex flex-col">
                    <div className="relative rounded-xl overflow-hidden shadow-md h-full flex flex-col">

                        <div onClick={() => setOpenExample2(true)} className="cursor-pointer">
                            <div className="relative h-[360px] group">
                                <Image
                                    src={"https://cdn-greet.s3.amazonaws.com/1696189069774.jpeg"}
                                    alt="Content image"
                                    fill
                                    className="w-full h-full object-cover"
                                />
                                <div className="hidden group-hover:flex absolute bg-gray-200 bg-opacity-75 transition-opacity ease-in duration-200 w-full h-full items-center justify-center">
                                    <p className="text-gray-900 font-semibold">Preview Media</p>
                                </div>
                                <div className="absolute top-0 right-0 m-3 rounded-full bg-business-500 h-8 w-8 flex items-center justify-center">
                                    <VideoCameraIcon className="h-4 w-4 text-business-50" />
                                </div>
                            </div>
                        </div>

                        {/* Content Details */}
                        <div className="flex-1 flex flex-col">
                            <div className="text-start px-6 py-4 flex-1 flex flex-col">
                                <div className="flex items-center space-x-2">
                                    <div className="relative h-12 w-12 flex-shrink-0 rounded-full bg-gray-100">
                                        <ProfilePicture
                                            size="3rem"
                                            pictureUrl="https://cdn-greet.s3.amazonaws.com/1696189239682.jpg"
                                            name="Ramirez"
                                        />
                                    </div>
                                    <div className="w-full">
                                        <div className="flex items-center justify-between text-sm leading-6">
                                            <div className="flex w-0 flex-1 items-center">
                                                <p className="font-semibold text-gray-900 truncate flex-shrink">Ramirez</p>
                                            </div>
                                            <div className="flex-shrink-0 ml-2 flex justify-end text-sm leading-6 text-gray-700">
                                                {getConentTypeBage(MediaType.REEL)}
                                            </div>
                                        </div>
                                        <a target="_blank" href={`https://www.instagram.com/raulvsfood`} className="text-gray-500 text-sm font-medium underline hover:text-gray-700">
                                            @raulvsfood
                                        </a>
                                    </div>
                                </div>

                                <p className="flex-1 mt-2 text-gray-700 font-medium text-sm text-start">
                                    #RaulvsFood in #Pasadena #Coffee and #Croissants for #Breakfast @_ohlalabakery_
                                </p>

                                <div className="flex items-center justify-between">

                                    <div className="mt-2 flex items-center space-x-4">

                                        <div>
                                            <p className="font-semibold text-sm text-gray-900">2.6K</p>
                                            <p className="text-sm text-gray-500 truncate">Engagement</p>
                                        </div>

                                        <div>
                                            <p className="font-semibold text-sm text-gray-900">3.1k</p>
                                            <p className="text-sm text-gray-500">Reach</p>
                                        </div>

                                        <div>
                                            <p className="font-semibold text-sm text-gray-900">1.2k</p>
                                            <p className="text-sm text-gray-500">Likes</p>
                                        </div>


                                        <div>
                                            <p className="font-semibold text-sm text-gray-900">31</p>
                                            <p className="text-sm text-gray-500">Comments</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <a download href={'https://cdn-greet.s3.amazonaws.com/1696189073431.mp4'} className="cursor-pointer">
                                            <ArrowDownTrayIcon className="h-5 w-5 text-gray-800 hover:text-gray-500" aria-hidden="true" />
                                        </a>
                                        <a target="_blank" href={'https://www.instagram.com/p/CxQu6Cvx77C/'} className="cursor-pointer">
                                            <LinkIcon className="h-5 w-5 text-gray-800 hover:text-gray-500" aria-hidden="true" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>

                {/* Example 3 */}
                <li className="col-span-1 flex flex-col">
                    <div className="relative rounded-xl overflow-hidden shadow-md h-full flex flex-col">

                        {/* Content Thumbnail */}
                        <div onClick={() => setOpenExample1(true)} className="cursor-pointer">
                            <div className="relative h-[360px] group">
                                <Image
                                    src={"https://cdn-greet.s3.amazonaws.com/1696189521554.jpeg"}
                                    alt="Content image"
                                    fill
                                    className="w-full h-full object-cover"
                                />
                                <div className="hidden group-hover:flex absolute bg-gray-200 bg-opacity-75 transition-opacity ease-in duration-200 w-full h-full items-center justify-center">
                                    <p className="text-gray-900 font-semibold">Preview Media</p>
                                </div>
                                <div className="absolute top-0 right-0 m-3 rounded-full bg-business-500 h-8 w-8 flex items-center justify-center">
                                    <VideoCameraIcon className="h-4 w-4 text-business-50" />
                                </div>
                            </div>
                        </div>

                        {/* Content Details */}
                        <div className="flex-1 flex flex-col">
                            <div className="text-start px-6 py-4 flex-1 flex flex-col">
                                <div className="flex items-center space-x-2">
                                    <div className="relative h-12 w-12 flex-shrink-0 rounded-full bg-gray-100">
                                        <ProfilePicture
                                            size="3rem"
                                            pictureUrl="https://cdn-greet.s3.amazonaws.com/1696189434597.jpg"
                                            name="Arnaldo Maidana De Oliveira"
                                        />
                                    </div>
                                    <div className="w-full">
                                        <div className="flex items-center justify-between text-sm leading-6">
                                            <div className="flex w-0 flex-1 items-center">
                                                <p className="font-semibold text-gray-900 truncate flex-shrink">Arnaldo Maidana De Oliveira</p>
                                            </div>
                                            <div className="flex-shrink-0 ml-2 flex justify-end text-sm leading-6 text-gray-700">
                                                {getConentTypeBage(MediaType.REEL)}
                                            </div>
                                        </div>
                                        <a target="_blank" href={`https://www.instagram.com/arnaldomaidana`} className="text-gray-500 text-sm font-medium underline hover:text-gray-700">
                                            @arnaldomaidana
                                        </a>
                                    </div>
                                </div>

                                <p className="flex-1 mt-2 text-gray-700 font-medium text-sm text-start">
                                    Visiting one of the best bakery in LA @_ohlalabakery_
                                </p>

                                <div className="flex items-center justify-between">

                                    <div className="mt-2 flex items-center space-x-4">

                                        <div>
                                            <p className="font-semibold text-sm text-gray-900">9.8K</p>
                                            <p className="text-sm text-gray-500 truncate">Engagement</p>
                                        </div>

                                        <div>
                                            <p className="font-semibold text-sm text-gray-900">13.9kk</p>
                                            <p className="text-sm text-gray-500">Reach</p>
                                        </div>

                                        <div>
                                            <p className="font-semibold text-sm text-gray-900">6.8k</p>
                                            <p className="text-sm text-gray-500">Likes</p>
                                        </div>


                                        <div>
                                            <p className="font-semibold text-sm text-gray-900">1.2k</p>
                                            <p className="text-sm text-gray-500">Comments</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <a download href={'https://cdn-greet.s3.amazonaws.com/1696189560702.mp4'} className="cursor-pointer">
                                            <ArrowDownTrayIcon className="h-5 w-5 text-gray-800 hover:text-gray-500" aria-hidden="true" />
                                        </a>
                                        <a target="_blank" href={'https://www.instagram.com/p/Cv5u9EVOF-7/'} className="cursor-pointer">
                                            <LinkIcon className="h-5 w-5 text-gray-800 hover:text-gray-500" aria-hidden="true" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </>
    );
}
