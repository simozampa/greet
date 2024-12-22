'use client'

import { useState } from 'react';
import { isFormDataEmpty, readFile } from '../_utils/helpers';
import InputError from './InputError';
import { PhotoIcon } from '@heroicons/react/24/outline';
import SecondaryButton from './SecondaryButton';
import Image from 'next/image';

interface ComponentProps {
    defaultValue: string,
    onChange: (image: string) => void;
}

export default function PhotoInput({ defaultValue, onChange }: ComponentProps) {

    const [currentImage, setCurrentImage] = useState<string>(defaultValue);
    const [uploadImageErrors, setUploadImageErrors] = useState<string[]>([]);
    const [uploadingImageLoading, setUploadingImageLoading] = useState<boolean>(false);

    const prepareImagesForUpload = async (
        files: FileList
    ): Promise<{ data: FormData; errors: string[] }> => {
        const formData: FormData = new FormData();
        const errors: string[] = [];
    
        for (let i = 0; i < files.length; i++) {
            if (!files[i]) {
                continue;
            }
    
            if (
                ![
                    "image/png",
                    "image/jpeg",
                    "image/gif",
                    "image/webp",
                    "image/avif",
                ].includes(files[i].type)
            ) {
                errors.push(
                    `${files[i].name} - Invalid file type. Allowed types: PNG, JPG, GIF, WEBP, AVIF`
                );
                continue;
            }
    
            if (files[i].size > 10 * 1024 * 1024) {
                errors.push(`${files[i].name} - File size exceeds the limit of 10MB`);
                continue;
            }
    
            const fileData = await readFile(files[i]);
            if (fileData) {
                formData.append("file", new Blob([fileData]), files[i].name);
            }
        }
    
        return { data: formData, errors: errors };
    }

    const onUserAddedImage = async (e: React.ChangeEvent<HTMLInputElement>) => {

        setUploadingImageLoading(true);
        setUploadImageErrors([]);

        const files: FileList | null = e.target?.files;

        if (files && files.length > 0) {

            // Validate and prepare images
            const { data, errors }: { data: FormData, errors: string[] } = await prepareImagesForUpload(files);

            if (isFormDataEmpty(data)) {
                setUploadImageErrors((prevState: string[]) => ([
                    ...prevState, ...errors, "Please provide at least 1 image."
                ]));
                setUploadingImageLoading(false);
                return;
            }

            if (errors.length > 0) {
                setUploadImageErrors((prevState: string[]) => ([
                    ...prevState, ...errors
                ]));
                setUploadingImageLoading(false);
                return;
            }

            // We can safely upload all the images in "Data" because they have been validated
            const response = await fetch(`/api/upload-files`, {
                method: "POST",
                body: data,
            });

            if (!response.ok) {
                setUploadImageErrors((prevState: string[]) => ([
                    ...prevState, ...errors, "Unexpected error while uploading images."
                ]));
                setUploadingImageLoading(false);
                return;
            }
            const imageLinks: string[] = await response.json();

            onChange(imageLinks[0])
            setCurrentImage(imageLinks[0]);
        }

        setUploadingImageLoading(false);
    };

    return (
        <>
            <div>
                {
                    uploadingImageLoading ? (
                        <div className='w-full flex items-center justify-center'>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    ) : (
                        <div className="mt-2 flex items-center gap-x-3">
                            {
                                currentImage ? (
                                    <div className="relative h-12 w-12 aspect-1 object-cover">
                                        <Image
                                            src={currentImage}
                                            fill
                                            sizes="3rem"
                                            alt={`Business Logo`}
                                            className="rounded-full"
                                        />
                                    </div>
                                ) : (
                                    <PhotoIcon className="h-12 w-12 text-gray-300" aria-hidden="true" />
                                )
                            }
                            <SecondaryButton className='px-0 py-0'>
                                <label htmlFor="file-upload" className="cursor-pointer px-2.5 py-1.5">
                                    Change
                                    <input id="file-upload" type="file" className="sr-only" onChange={onUserAddedImage} />
                                </label>
                            </SecondaryButton>
                        </div>
                    )
                }
            </div>

            <div className='flex flex-wrap'>
                {
                    uploadImageErrors.map((errorMessage: string) => (
                        <InputError key={errorMessage} className="w-full" errorMessage={errorMessage} />
                    ))
                }
            </div>

            {/* <ul role="list" className="mt-2 grid grid-cols-3 gap-6 lg:grid-cols-4">
                {currentImage.map((url: string) => (
                    <li
                        key={url}
                        className="relative group cursor-pointer"
                        onClick={() => removeImage()}
                    >
                        <img className="h-auto max-w-full rounded-lg aspect-1 object-cover group-hover:opacity-60" src={url} />
                        <XMarkIcon className='hidden group-hover:block absolute right-0 top-0 m-3 w-4 h-4 text-red-500 cursor-pointer hover:text-red-700' />
                    </li>
                ))}
            </ul> */}
        </>
    )
}