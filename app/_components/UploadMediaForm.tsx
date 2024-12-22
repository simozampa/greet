'use client'

import InputError from "@/app/_components/InputError";
import InputLabel from "@/app/_components/InputLabel";
import InputSuccess from "@/app/_components/InputSuccess";
import PrimaryButton from "@/app/_components/PrimaryButton";
import { cn, isFormDataEmpty, readFile } from "@/app/_utils/helpers";
import useForm from "@/app/_utils/useForm";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Business, MediaType, SocialType } from "@prisma/client";
import { Fragment, useState } from "react";
import { UserWithRelations } from "../_utils/db";
import InputSelect from "./InputSelect";
import InputText from "./InputText";
import { createMediaObject } from "../actions";

export type UploadMediaSchemaType = {
    creator: UserWithRelations | null;
    business: Business | null;
    socialType: SocialType;
    mediaType: MediaType;
    permalink: string;
    caption: string;
    commentsCount: number;
    likeCount: number;
    thumbnail: string;
    reach: number;
    impressions: number;
    totalInteractions: number;
    url: string;
}

interface UploadMediaFormProps {
    creators: UserWithRelations[]
    businesses: Business[]
}

export default function UploadMediaForm({ creators, businesses }: UploadMediaFormProps) {

    const form = useForm<UploadMediaSchemaType>({
        creator: null,
        business: null,
        socialType: SocialType.INSTAGRAM,
        mediaType: MediaType.POST,
        permalink: "",
        caption: "",
        commentsCount: -1,
        likeCount: -1,
        thumbnail: "",
        reach: -1,
        impressions: -1,
        totalInteractions: -1,
        url: ""
    });

    const [submitError, setSubmitError] = useState<boolean>();
    const [submitSuccess, setSubmitSuccess] = useState<boolean>();

    const [uploadMediaErrors, setUploadMediaErrors] = useState<string[]>([])
    const [uploadingMediaLoading, setUploadingMediaLoading] = useState<boolean>(false)

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
                    "video/mp4"
                ].includes(files[i].type)
            ) {
                errors.push(
                    `${files[i].name} - Invalid file type. Allowed types: PNG, JPG, GIF, WEBP, AVIF, MP4`
                );
                continue;
            }

            const fileData = await readFile(files[i]);
            if (fileData) {
                formData.append("file", new Blob([fileData]), files[i].name);
            }
        }

        return { data: formData, errors: errors };
    }

    const onUserAddedImages = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {

        setUploadingMediaLoading(true);
        setUploadMediaErrors([]);

        const files: FileList | null = e.target?.files;

        if (files && files.length > 0) {

            // Validate and prepare images
            const { data, errors }: { data: FormData, errors: string[] } = await prepareImagesForUpload(files);

            if (isFormDataEmpty(data)) {
                setUploadMediaErrors((prevState: string[]) => ([
                    ...prevState, ...errors
                ]));
                setUploadingMediaLoading(false);
                return;
            }

            if (errors.length > 0) {
                setUploadMediaErrors((prevState: string[]) => ([
                    ...prevState, ...errors
                ]));
                setUploadingMediaLoading(false);
                return;
            }

            // We can safely upload all the images in "Data" because they have been validated
            const response = await fetch(`/api/upload-files`, {
                method: "POST",
                body: data,
            });

            if (!response.ok) {
                setUploadMediaErrors((prevState: string[]) => ([
                    ...prevState, ...errors, "Unexpected error while uploading images."
                ]));
                setUploadingMediaLoading(false);
                return;
            }
            const mediaLinks: string[] = await response.json();

            form.setData(key as keyof UploadMediaSchemaType, mediaLinks[0])
        }

        setUploadingMediaLoading(false);
    };

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitError(false);
        setSubmitSuccess(false);
        form.clearErrors();

        // add media format
        const { isValid, errors } = await createMediaObject(form.data);

        if (!isValid) {
            form.setError(errors as Record<keyof UploadMediaSchemaType, string>);
            setSubmitError(true)
            return;
        }

        setSubmitSuccess(true);
    };

    return (
        <form onSubmit={submit} className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">

            {/* User */}
            <div className="col-span-full lg:col-span-3" >
                <InputLabel htmlFor="business" name="User" required={true} />
                <div className="mt-1">

                    <Listbox value={form.data.creator} onChange={(val: UserWithRelations) => form.setData('creator', val)}>
                        {({ open }) => (
                            <>
                                <div className="relative">
                                    <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 sm:text-sm sm:leading-6">
                                        <span className="inline-flex w-full truncate">
                                            {form.data.creator ?
                                                <>
                                                    <span className="truncate">{`${form.data.creator?.firstName} ${form.data.creator?.lastName}`}</span>
                                                    <span className="ml-2 truncate text-gray-500">@{form.data.creator?.instagramAccount?.username}</span>
                                                </>
                                                :
                                                <>
                                                    <span className="truncate text-gray-500">Select a creator...</span>
                                                </>
                                            }
                                        </span>
                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                        </span>
                                    </Listbox.Button>

                                    <Transition
                                        show={open}
                                        as={Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                            {creators.map((creator) => (
                                                <Listbox.Option
                                                    key={creator.id}
                                                    className={({ active }) =>
                                                        cn(
                                                            active ? 'bg-gray-100' : 'text-gray-900',
                                                            'relative cursor-default select-none py-2 pl-3 pr-9'
                                                        )
                                                    }
                                                    value={creator}
                                                >
                                                    {({ selected, active }) => (
                                                        <>
                                                            <div className="flex">
                                                                <span className={cn(selected ? 'font-semibold' : 'font-normal', 'truncate')}>
                                                                    {`${creator.firstName} ${creator.lastName}`}
                                                                </span>
                                                                <span className={cn(active ? 'text-gray-500' : 'text-gray-500', 'ml-2 truncate')}>
                                                                    @{creator.instagramAccount?.username}
                                                                </span>
                                                            </div>

                                                            {selected ? (
                                                                <span
                                                                    className={cn(
                                                                        active ? 'text-white' : 'text-gray-900',
                                                                        'absolute inset-y-0 right-0 flex items-center pr-4'
                                                                    )}
                                                                >
                                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                </span>
                                                            ) : null}
                                                        </>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Listbox>
                </div>
                <InputError errorMessage={form.errors?.creator} />
            </div>

            {/* Business */}
            <div className="col-span-full lg:col-span-3" >
                <InputLabel htmlFor="business" name="Business" required={true} />
                <div className="mt-1">

                    <Listbox value={form.data.business} onChange={(val: Business) => form.setData('business', val)}>
                        {({ open }) => (
                            <>
                                <div className="relative">
                                    <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 sm:text-sm sm:leading-6">
                                        <span className="inline-flex w-full truncate">
                                            {form.data.business ?
                                                <>
                                                    <span className="truncate">{form.data.business.name}</span>
                                                    <span className="ml-2 truncate text-gray-500">@{form.data.business.instagram}</span>
                                                </>
                                                :
                                                <>
                                                    <span className="truncate text-gray-500">Select a business...</span>
                                                </>
                                            }
                                        </span>
                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                        </span>
                                    </Listbox.Button>

                                    <Transition
                                        show={open}
                                        as={Fragment}
                                        leave="transition ease-in duration-100"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                            {businesses.map((business) => (
                                                <Listbox.Option
                                                    key={business.id}
                                                    className={({ active }) =>
                                                        cn(
                                                            active ? 'bg-gray-50' : 'text-gray-900',
                                                            'relative cursor-default select-none py-2 pl-3 pr-9'
                                                        )
                                                    }
                                                    value={business}
                                                >
                                                    {({ selected, active }) => (
                                                        <>
                                                            <div className="flex">
                                                                <span className={cn(selected ? 'font-semibold' : 'font-normal', 'truncate')}>
                                                                    {`${business.name}`}
                                                                </span>
                                                                <span className={cn(active ? 'text-gray-500' : 'text-gray-500', 'ml-2 truncate')}>
                                                                    @{business.instagram}
                                                                </span>
                                                            </div>

                                                            {selected ? (
                                                                <span
                                                                    className={cn(
                                                                        active ? 'text-white' : 'text-gray-900',
                                                                        'absolute inset-y-0 right-0 flex items-center pr-4'
                                                                    )}
                                                                >
                                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                </span>
                                                            ) : null}
                                                        </>
                                                    )}
                                                </Listbox.Option>
                                            ))}
                                        </Listbox.Options>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Listbox>
                </div>
                <InputError errorMessage={form.errors?.business} />
            </div>

            {/* Social Type */}
            <div className="col-span-full lg:col-span-2">
                <InputLabel htmlFor="socialType" name="Social Type" required={true} />
                <div className="mt-1">
                    <InputSelect
                        name="socialType"
                        value={form.data.socialType}
                        onChange={e => form.setData('socialType', e.target.value as SocialType)}
                        options={Object.entries(SocialType).map(([key, value]) => ({
                            value,
                            label: key
                        }))}
                    />
                </div>
                <InputError errorMessage={form.errors?.socialType} />
            </div>

            {/* Media Type */}
            <div className="col-span-full lg:col-span-2">
                <InputLabel htmlFor="mediaType" name="Media Type" required={true} />
                <div className="mt-1">
                    <InputSelect
                        name="mediaType"
                        value={form.data.mediaType}
                        onChange={e => form.setData('mediaType', e.target.value as MediaType)}
                        options={Object.entries(MediaType).map(([key, value]) => ({
                            value,
                            label: key
                        }))}
                    />
                </div>
                <InputError errorMessage={form.errors?.mediaType} />
            </div>

            {/* Permalink */}
            <div className="col-span-full lg:col-span-2">
                <InputLabel htmlFor="permalink" name="Permalink" />
                <div className="mt-1">
                    <InputText
                        name="permalink"
                        value={form.data.permalink}
                        onChange={e => form.setData('permalink', e.target.value)}
                    />
                </div>
                <InputError errorMessage={form.errors?.permalink} />
            </div>

            {/* Caption */}
            <div className="col-span-full lg:col-span-2">
                <InputLabel htmlFor="caption" name="Caption" />
                <div className="mt-1">
                    <InputText
                        name="caption"
                        value={form.data.caption}
                        onChange={e => form.setData('caption', e.target.value)}
                    />
                </div>
                <InputError errorMessage={form.errors?.caption} />
            </div>

            {/* Comments Count */}
            <div className="col-span-full lg:col-span-2">
                <InputLabel htmlFor="commentsCount" name="Comments Count" />
                <div className="mt-1">
                    <InputText
                        name="commentsCount"
                        type="number"
                        value={form.data.commentsCount}
                        onChange={e => form.setData('commentsCount', Number(e.target.value))}
                    />
                </div>
                <InputError errorMessage={form.errors?.commentsCount} />
            </div>

            {/* Like Count */}
            <div className="col-span-full lg:col-span-2">
                <InputLabel htmlFor="likeCount" name="Like Count" />
                <div className="mt-1">
                    <InputText
                        name="likeCount"
                        type="number"
                        value={form.data.likeCount}
                        onChange={e => form.setData('likeCount', Number(e.target.value))}
                    />
                </div>
                <InputError errorMessage={form.errors?.likeCount} />
            </div>

            {/* Reach */}
            <div className="col-span-full lg:col-span-2">
                <InputLabel htmlFor="reach" name="Reach" />
                <div className="mt-1">
                    <InputText
                        name="reach"
                        type="number"
                        value={form.data.reach}
                        onChange={e => form.setData('reach', Number(e.target.value))}
                    />
                </div>
                <InputError errorMessage={form.errors?.reach} />
            </div>

            {/* Impressions */}
            <div className="col-span-full lg:col-span-2">
                <InputLabel htmlFor="impressions" name="Impressions" />
                <div className="mt-1">
                    <InputText
                        name="likeCount"
                        type="number"
                        value={form.data.impressions}
                        onChange={e => form.setData('impressions', Number(e.target.value))}
                    />
                </div>
                <InputError errorMessage={form.errors?.impressions} />
            </div>

            {/* Total Interactions */}
            <div className="col-span-full lg:col-span-2">
                <InputLabel htmlFor="totalInteractions" name="Total Interactions" />
                <div className="mt-1">
                    <InputText
                        name="totalInteractions"
                        type="number"
                        value={form.data.totalInteractions}
                        onChange={e => form.setData('totalInteractions', Number(e.target.value))}
                    />
                </div>
                <InputError errorMessage={form.errors?.totalInteractions} />
            </div>

            {/* Thumbnail */}
            <div className="col-span-full" >
                <InputLabel htmlFor="thumbnail" name="Thumbnail" />
                <div className="mt-1">

                    {form.data.thumbnail === "" ?
                        (
                            <>
                                <div>
                                    {
                                        uploadingMediaLoading ? (
                                            <div className='w-full flex items-center justify-center'>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            </div>
                                        ) : (
                                            <label htmlFor="thumbnail-upload" className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 cursor-pointer">
                                                <div className="text-center">
                                                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                                    <div className="mt-4 flex justify-center text-sm leading-6 text-gray-600">
                                                        <div
                                                            className="relative cursor-pointer rounded-md bg-white font-semibold text-gray-900 focus-within:outline-none focus-within:ring-2 focus-within:ring-gray-900 focus-within:ring-offset-2 hover:text-gray-700"
                                                        >
                                                            <span>Upload a file</span>
                                                            <input id="thumbnail-upload" type="file" className="sr-only" onChange={(e) => onUserAddedImages(e, "thumbnail")} />
                                                        </div>
                                                    </div>
                                                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF, WEBP, AVIF, MP4</p>
                                                </div>
                                            </label>
                                        )
                                    }
                                </div>

                                <div className='flex flex-wrap'>
                                    {
                                        uploadMediaErrors.map((errorMessage: string) => (
                                            <InputError key={errorMessage} className="w-full" errorMessage={errorMessage} />
                                        ))
                                    }
                                </div>
                            </>
                        )
                        :
                        (
                            <div className="mt-2">
                                <div
                                    className="flex items-center justify-between text-sm"

                                >
                                    {form.data.thumbnail}
                                    <XMarkIcon
                                        onClick={() => form.setData("thumbnail", "")}
                                        className='w-6 h-6 text-red-500 cursor-pointer hover:text-red-700'
                                    />
                                </div>
                            </div>
                        )
                    }

                </div>
                <InputError className="w-full" errorMessage={form.errors?.thumbnail} />
            </div>

            {/* Media */}
            <div className="col-span-full" >
                <InputLabel htmlFor="media" name="Media" required={true} />
                <div className="mt-1">

                    {form.data.url === "" ?
                        (
                            <>
                                <div>
                                    {
                                        uploadingMediaLoading ? (
                                            <div className='w-full flex items-center justify-center'>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            </div>
                                        ) : (
                                            <label htmlFor="media-upload" className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 cursor-pointer">
                                                <div className="text-center">
                                                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                                    <div className="mt-4 flex justify-center text-sm leading-6 text-gray-600">
                                                        <div
                                                            className="relative cursor-pointer rounded-md bg-white font-semibold text-gray-900 focus-within:outline-none focus-within:ring-2 focus-within:ring-gray-900 focus-within:ring-offset-2 hover:text-gray-700"
                                                        >
                                                            <span>Upload a file</span>
                                                            <input id="media-upload" type="file" className="sr-only" onChange={(e) => onUserAddedImages(e, "url")} />
                                                        </div>
                                                    </div>
                                                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF, WEBP, AVIF, MP4</p>
                                                </div>
                                            </label>
                                        )
                                    }
                                </div>

                                <div className='flex flex-wrap'>
                                    {
                                        uploadMediaErrors.map((errorMessage: string) => (
                                            <InputError key={errorMessage} className="w-full" errorMessage={errorMessage} />
                                        ))
                                    }
                                </div>
                            </>
                        )
                        :
                        (
                            <div className="mt-2">
                                <div
                                    className="flex items-center justify-between text-sm"

                                >
                                    {form.data.url}
                                    <XMarkIcon
                                        onClick={() => form.setData("url", "")}
                                        className='w-6 h-6 text-red-500 cursor-pointer hover:text-red-700'
                                    />
                                </div>
                            </div>
                        )
                    }

                </div>
                <InputError className="w-full" errorMessage={form.errors?.url} />
            </div>

            {/* Submit */}
            <div className="col-span-full py-6 flex items-center justify-end gap-x-6 border-b border-gray-900/10">

                {submitError &&
                    <InputError errorMessage="Error!" />
                }
                {submitSuccess &&
                    <InputSuccess successMessage="Media uploaded and posted to account successfully." />
                }

                <PrimaryButton
                    type="submit"
                    disabled={form.processing}
                >
                    {form.processing &&
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    }
                    Submit
                </PrimaryButton>
            </div>
        </form>
    )
}