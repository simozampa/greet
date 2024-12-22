'use client'

import Image from "next/image";
import ProfilePicture from "../../_components/ProfilePicture";
import { MediaWithRelations } from "../../_utils/db";
import { formatInstagramMetric, getConentTypeBage } from "../../_utils/helpers";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { LinkIcon, PhotoIcon, VideoCameraIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Modal from "../../_components/Modal";
import { useState } from "react";
import SecondaryButton from "../../_components/SecondaryButton";

interface BusinessContentCardProps {
    content: MediaWithRelations
}

export default function BusinessContentCard({ content }: BusinessContentCardProps) {

    const getContentUrl = () => {
        return isVideo() ? content.thumbnail : content.url;
    }

    const isVideo = (): boolean => {
        const videoExtensions = [".mp4", ".webm", ".ogg", ".avi", ".mov"];
        const extension = content.url.slice(content.url.lastIndexOf('.')).toLowerCase();
        return videoExtensions.includes(extension);
    }

    let [open, setOpen] = useState<boolean>(false)

    return (
        <>
            <Modal show={open} onClose={() => setOpen(false)} >
                <div className="rounded-lg overflow-scroll-y bg-white p-4 max-w-sm text-left shadow-xl w-full sm:p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-semibold leading-6 text-gray-900">
                            Media Preview
                        </h3>
                        <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                            onClick={() => setOpen(false)}
                        >
                            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="mt-4">
                        {isVideo() ? (
                            <video autoPlay controls width="100%" height="100%" className="aspect-[9/16] rounded-md">
                                <source src={content.url} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <div className="relative h-[360px] aspect-[9/16] rounded-md">
                                {getContentUrl() ? (
                                    <Image
                                        src={getContentUrl() ?? ""}
                                        alt="Content image"
                                        fill
                                        className="w-full h-full object-cover aspect-[9/16] rounded-md"
                                    />
                                ) : (
                                    <div className="w-full h-full object-cover bg-gray-100 flex items-center justify-center aspect-[9/16] rounded-md">
                                        <PhotoIcon className="h-10 w-10 text-gray-300" />
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                    <div className="mt-5 sm:mt-6">
                        <a download href={content.url}>
                            <SecondaryButton className="space-x-2 w-full">
                                <ArrowDownTrayIcon className="h-5 w-5 text-gray-800 hover:text-gray-500" aria-hidden="true" />
                                <span>Download Media</span>
                            </SecondaryButton>
                        </a>
                    </div>
                </div>
            </Modal>

            <div className="relative rounded-xl overflow-hidden shadow-md h-full flex flex-col">

                {/* Content Thumbnail */}
                <div onClick={() => setOpen(true)} className="cursor-pointer">
                    <div className="relative h-[360px] group cursor-pointer">
                        {getContentUrl() ? (
                            <Image
                                src={getContentUrl() ?? ""}
                                alt="Content image"
                                fill
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full object-cover bg-gray-100 flex items-center justify-center">
                                <PhotoIcon className="h-10 w-10 text-gray-300" />
                            </div>
                        )}
                        <div className="hidden group-hover:flex absolute bg-gray-200 bg-opacity-75 transition-opacity ease-in duration-200 w-full h-full items-center justify-center">
                            <p className="text-gray-900 font-semibold">Preview Media</p>
                        </div>
                        <div className="absolute top-0 right-0 m-3 rounded-full bg-business-500 h-8 w-8 flex items-center justify-center">

                            {isVideo() ? (
                                <VideoCameraIcon className="h-4 w-4 text-business-50" />
                            ) : (
                                <PhotoIcon className="h-4 w-4 text-business-50" />
                            )}
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
                                    pictureUrl={content.user.instagramAccount?.profilePictureUrl}
                                    name={content.user?.firstName + ' ' + content.user.lastName}
                                />
                            </div>
                            <div className="w-full">
                                <div className="flex items-center justify-between text-sm leading-6">
                                    <div className="flex w-0 flex-1 items-center">
                                        <p className="font-semibold text-gray-900 truncate flex-shrink">{content.user.instagramAccount?.name ? content.user.instagramAccount?.name : content.user.firstName + " " + content.user.lastName}</p>
                                    </div>
                                    <div className="flex-shrink-0 ml-2 flex justify-end text-sm leading-6 text-gray-700">
                                        {getConentTypeBage(content.type)}
                                    </div>
                                </div>
                                <a target="_blank" href={`https://www.instagram.com/${content.user.instagramAccount?.username}`} className="text-gray-500 text-sm font-medium underline hover:text-gray-700">
                                    @{content.user.instagramAccount?.username}
                                </a>
                            </div>
                        </div>

                        {content.caption &&
                            <p className="flex-1 mt-2 text-gray-700 font-medium text-sm text-start">
                                {content.caption}
                            </p>
                        }

                        <div className="flex items-center justify-between">

                            <div className="mt-2 flex items-center space-x-4">
                                {(content.totalInteractions && content.totalInteractions !== -1) &&
                                    (
                                        <div>
                                            <p className="font-semibold text-sm text-gray-900">{formatInstagramMetric(content.totalInteractions)}</p>
                                            <p className="text-sm text-gray-500 truncate">Engagement</p>
                                        </div>
                                    )
                                }

                                {(content.reach && content.reach !== -1) && (
                                    <div>
                                        <p className="font-semibold text-sm text-gray-900">{formatInstagramMetric(content.reach)}</p>
                                        <p className="text-sm text-gray-500">Reach</p>
                                    </div>
                                )}

                                {(content.likeCount && content.likeCount !== -1) &&
                                    <div>
                                        <p className="font-semibold text-sm text-gray-900">{formatInstagramMetric(content.likeCount)}</p>
                                        <p className="text-sm text-gray-500">Likes</p>
                                    </div>
                                }

                                {(content.commentsCount && content.commentsCount !== -1) &&
                                    <div>
                                        <p className="font-semibold text-sm text-gray-900">{formatInstagramMetric(content.commentsCount)}</p>
                                        <p className="text-sm text-gray-500">Comments</p>
                                    </div>
                                }
                            </div>

                            <div className="flex items-center space-x-3">
                                <a download href={content.url} className="cursor-pointer">
                                    <ArrowDownTrayIcon className="h-5 w-5 text-gray-800 hover:text-gray-500" aria-hidden="true" />
                                </a>
                                {content.permalink && (
                                    <a target="_blank" href={content.permalink} className="cursor-pointer">
                                        <LinkIcon className="h-5 w-5 text-gray-800 hover:text-gray-500" aria-hidden="true" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}