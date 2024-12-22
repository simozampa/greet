'use client'
import Image from "next/image"
import { getInitials } from "../_utils/helpers"
import { useState } from "react"

interface ProfilePictureProps {
    size: string
    pictureUrl: string | undefined,
    name: string
}

export default function ProfilePicture({ size, pictureUrl, name }: ProfilePictureProps) {

    const [imageError, setImageError] = useState<boolean>(false);

    return (
        <>
            {pictureUrl ?
                (
                    <>
                        {!imageError ?
                            <Image
                                src={pictureUrl}
                                fill
                                sizes={size}
                                alt={`${name} Profile Picture`}
                                className="rounded-full"
                                onError={(e) => {
                                    setImageError(true);
                                }}
                            />
                            :
                            <div className='flex items-center justify-center w-full h-full rounded-full bg-gray-100 text-xs'>
                                {getInitials(name)}
                            </div>
                        }

                    </>
                )
                :
                <div className='flex items-center justify-center w-full h-full rounded-full bg-gray-100 text-xs'>
                    {getInitials(name)}
                </div>
            }
        </>
    )
}