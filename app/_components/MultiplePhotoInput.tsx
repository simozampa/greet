'use client'

import { PhotoIcon } from '@heroicons/react/24/solid'
import { useState } from 'react';
import { isFormDataEmpty, readFile } from '../_utils/helpers';
import InputError from './InputError';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useMountEffect } from '../_utils/useMountEffect';
import Image from 'next/image';

interface ComponentProps {
    defaultValue: string[],
    onChange: (images: string[]) => void;
}

export default function MultiplePhotoInput({ defaultValue, onChange }: ComponentProps) {

    const [currentImages, setCurrentImages] = useState<string[]>([])
    const [uploadImagesErrors, setUploadImagesErrors] = useState<string[]>([])
    const [uploadingImagesLoading, setUploadingImagesLoading] = useState<boolean>(false)

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

    const onUserAddedImages = async (e: React.ChangeEvent<HTMLInputElement>) => {

        setUploadingImagesLoading(true);
        setUploadImagesErrors([]);

        const files: FileList | null = e.target?.files;

        if (files && files.length > 0) {

            // We always allow maximum 10 images.
            if (10 - (files.length + currentImages.length) < 0) {
                setUploadImagesErrors((prevState: string[]) => ([
                    ...prevState, "Limit to only 10 images."
                ]));
                setUploadingImagesLoading(false);
                return;
            }

            // Validate and prepare images
            const { data, errors }: { data: FormData, errors: string[] } = await prepareImagesForUpload(files);

            if (isFormDataEmpty(data)) {
                setUploadImagesErrors((prevState: string[]) => ([
                    ...prevState, ...errors
                ]));
                setUploadingImagesLoading(false);
                return;
            }

            if (errors.length > 0) {
                setUploadImagesErrors((prevState: string[]) => ([
                    ...prevState, ...errors
                ]));
                setUploadingImagesLoading(false);
                return;
            }

            // We can safely upload all the images in "Data" because they have been validated
            const response = await fetch(`/api/upload-files`, {
                method: "POST",
                body: data,
            });

            if (!response.ok) {
                setUploadImagesErrors((prevState: string[]) => ([
                    ...prevState, ...errors, "Unexpected error while uploading images."
                ]));
                setUploadingImagesLoading(false);
                return;
            }
            const imageLinks: string[] = await response.json();

            onChange([...currentImages, ...imageLinks])
            setCurrentImages((prevState: string[]) => ([
                ...prevState, ...imageLinks
            ]));
        }

        setUploadingImagesLoading(false);
    };

    const removeImage = (toRemoveUrl: string) => {
        const updatedCurrentImages = currentImages.filter((url: string) => url !== toRemoveUrl);
        onChange(updatedCurrentImages);
        setCurrentImages(updatedCurrentImages);
    };

    useMountEffect(() => setCurrentImages(defaultValue));

    return (
        <>
            <div>
                {
                    uploadingImagesLoading ? (
                        <div className='w-full flex items-center justify-center'>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    ) : (
                        <label htmlFor="file-upload" className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 cursor-pointer">
                            <div className="text-center">
                                <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                <div className="mt-4 flex justify-center text-sm leading-6 text-gray-600">
                                    <div
                                        className="relative cursor-pointer rounded-md bg-white font-semibold text-gray-900 focus-within:outline-none focus-within:ring-2 focus-within:ring-gray-900 focus-within:ring-offset-2 hover:text-gray-700"
                                    >
                                        <span>Upload a file</span>
                                        <input id="file-upload" type="file" multiple className="sr-only" onChange={onUserAddedImages} />
                                    </div>
                                </div>
                                <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF, WEBP, AVIF up to 10MB</p>
                            </div>
                        </label>
                    )
                }
            </div>

            <div className='flex flex-wrap'>
                {
                    uploadImagesErrors.map((errorMessage: string) => (
                        <InputError key={errorMessage} className="w-full" errorMessage={errorMessage} />
                    ))
                }
            </div>

            <ul role="list" className="mt-2 grid grid-cols-3 gap-6 lg:grid-cols-4">
                {currentImages.map((url: string) => (
                    <li
                        key={url}
                        className="relative group cursor-pointer"
                        onClick={() => removeImage(url)}
                    >
                        <div className="relative h-auto max-w-full rounded-lg aspect-1 object-cover group-hover:opacity-60">
                            <Image
                                src={url}
                                fill
                                sizes="10rem"
                                alt={`Uploaded Image`}
                                className="rounded-lg"
                            />
                        </div>
                        <XMarkIcon className='hidden group-hover:block absolute right-0 top-0 m-3 w-4 h-4 text-red-500 cursor-pointer hover:text-red-700' />
                    </li>
                ))}
            </ul>
        </>
    )
}