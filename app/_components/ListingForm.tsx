'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import InputLabel from './InputLabel'
import InputText from './InputText'
import InputError from './InputError'
import PrimaryButton from './PrimaryButton'
import InputSuccess from './InputSuccess'
import InputTextArea from './InputTextArea'
import { BusinessWithRelations } from '../_utils/db';
import ScheduleSelector from './ScheduleSelector';
import MultiplePhotoInput from './MultiplePhotoInput';
import { Availability } from '../_utils';
import InputSwitch from './InputSwitch';
import InputCheckbox from './InputCheckbox';
import { Location } from '@prisma/client';
import useForm, { Errors } from '../_utils/useForm';
import { useSession } from 'next-auth/react';

export type ListingFormSchemaType = {
    active: boolean;
    title: string;
    offer: string;
    deal: string;
    images: string[];
    redeemAnytime: boolean;
    availability: Availability;
}

interface ListingFormProps {
    listingId?: string
    defaultValues: ListingFormSchemaType;
    submitButtonText: string;
    business: BusinessWithRelations;
    onUpdateRedirectUrl: string; 
}

export default function ListingForm({ listingId, defaultValues, submitButtonText, business, onUpdateRedirectUrl }: ListingFormProps) {

    const form = useForm<ListingFormSchemaType>({
        active: defaultValues.active,
        title: defaultValues.title,
        offer: defaultValues.offer,
        deal: defaultValues.deal,
        images: defaultValues.images,
        redeemAnytime: defaultValues.redeemAnytime,
        availability: defaultValues.availability
    });

    const router = useRouter();
    const { data: session, status } = useSession();
    const [submitSuccess, setSubmitSuccess] = useState<string>("");
    const [submitError, setSubmitError] = useState<string>("");

    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const [locationError, setLocationError] = useState<string>("");
    // const [redeemAnytime, setRedeemAnytime] = useState<boolean>(defaultValues.redeemAnytime !== undefined ? defaultValues.redeemAnytime : false);

    const submit = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        setSubmitSuccess("");
        setSubmitError("");

        // If creating a listing, make sure the user selected at least 1 location
        if (!listingId) {
            if (selectedLocations.length === 0) {
                setLocationError("Please select at least 1 location for this listing.");
                setSubmitError("Errors in the form, please check the fields for details.");
                return;
            }
            else {
                setLocationError("");
            }
        }

        form.transform((data: ListingFormSchemaType) => ({
            ...data,
            locationIds: selectedLocations,
            businessId: business?.id,
        }));

        // Are we Creating or Updating
        // If we have a listingId then we are updating 
        if (listingId) {
            // UPDATE
            form.put(`/api/businesses/${business.id}/listings/${listingId}`, {
                onSuccess: () => { onSuccessfulListing() },
                onError: (errors: Errors) => { console.error(errors); setSubmitError("Errors in the form, please check the fields for details."); },
            });
        }
        else {
            // CREATE
            form.post(`/api/businesses/${business.id}/listings`, {
                onSuccess: () => { onSuccessfulListing() },
                onError: (errors: Errors) => { console.error(errors); setSubmitError("Errors in the form, please check the fields for details."); },
            });
        }
    };

    const onSuccessfulListing = () => {
        setSubmitSuccess(`Listing ${listingId ? 'edited' : 'created'} sucessfully!`);

        router.push(onUpdateRedirectUrl);
        router.refresh();
    }

    const onLocationValueChange = (locationId: string) => {

        // We remove the location if present
        if (selectedLocations.includes(locationId)) {
            const filteredLocations = selectedLocations.filter(item => item !== locationId)
            setSelectedLocations(filteredLocations);
        }
        // Otherwise we add it.
        else {
            const updatedLocations = [locationId, ...selectedLocations]
            setSelectedLocations(updatedLocations);
        }
    };

    return (
        <form onSubmit={submit} className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">

            {/* Select Locations (only for "create") */}
            {!listingId &&
                <div className="col-span-full space-y-4">
                    <div className="">
                        <InputLabel htmlFor="locations" name="Locations" required={true} />
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            The listing will be available for the selected location(s). Please select at least 1 location.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {business.locations.map((location: Location) => (
                            <div key={location.id} className="relative flex gap-x-3">
                                <div className="flex h-6 items-center">
                                    <InputCheckbox
                                        checked={selectedLocations.includes(location.id)}
                                        onChange={() => onLocationValueChange(location.id)}
                                    />
                                </div>
                                <div className="text-sm leading-6">
                                    <label htmlFor="comments" className="font-medium text-gray-900">
                                        {location.name ? location.name : `${business.name} - Location`}
                                    </label>
                                    <p className="text-gray-500">When selected, this listing will apply to this location.</p>
                                </div>
                            </div>
                        ))}

                    </div>
                    <InputError errorMessage={locationError} />
                </div >
            }

            {/* Active switch */}
            <div className="col-span-full" >
                <InputLabel htmlFor="active" name="Active" required={true} />
                <p className="mt-1 text-sm leading-6 text-gray-600">
                    If toggled on, the listing will be visible to influencers, and they will be able to send booking requests.
                    You can always change this setting later.
                </p>
                <div className="mt-2">
                    <InputSwitch
                        defaultValue={defaultValues.active !== undefined ? defaultValues.active : true}
                        onChange={async (newValue: boolean) => {
                            form.setData("active", newValue)
                            // Return true to signify the update was successful.
                            return true;
                        }} />
                </div>
                <InputError errorMessage={form.errors?.active} />
            </div>

            {/* Title */}
            <div className="col-span-full" >
                <InputLabel htmlFor="title" name="Title" required={true} />
                <div className="mt-1">
                    <InputText
                        name="title"
                        value={form.data.title}
                        onChange={e => form.setData('title', e.target.value)}
                    />
                </div>
                <InputError errorMessage={form.errors?.title} />
            </div>

            {/* Offer */}
            <div className="col-span-full" >
                <InputLabel htmlFor="offer" name="Offer" required={true} />
                <div className="mt-1">
                    <InputTextArea
                        name="offer"
                        value={form.data.offer}
                        onChange={e => form.setData('offer', e.target.value)}
                    />
                </div>
                <InputError errorMessage={form.errors?.offer} />
            </div >

            {/* Deal */}
            <div className="col-span-full" >
                <InputLabel htmlFor="deal" name="Deal" required={true} />
                <div className="mt-1">
                    <InputTextArea
                        name="deal"
                        value={form.data.deal}
                        onChange={e => form.setData('deal', e.target.value)}
                    />
                </div>
                <InputError errorMessage={form.errors?.deal} />
            </div>

            {/* Listing Images */}
            <div className="col-span-full" >
                <InputLabel htmlFor="images" name="Listing Images" required={true} />
                <div className="mt-1">
                    <MultiplePhotoInput defaultValue={defaultValues.images || []} onChange={(images: string[]) => form.setData("images", images)} />
                </div>
                <InputError className="w-full" errorMessage={form.errors?.images} />
            </div>

            {/* Active switch */}

            {!listingId &&
                <div className="col-span-full" >
                    <InputLabel htmlFor="active" name="Redeem Anytime" required={true} />
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        If toggled on, once a creator is approved for this offer they will be able to redeem it within 30 days before it expires.
                        Redeem anytime allows for easier collaboration with creators, allowing you to partner with more high-quality influencers on a regular basis.<br />
                    </p>
                    <p className='mt-1 text-sm leading-6 text-gray-500 italic'>
                        If you require table reservations this may not be suitable for you.
                    </p>
                    <div className="mt-2">
                        <InputSwitch
                            defaultValue={form.data.redeemAnytime}
                            onChange={async (newValue: boolean) => {
                                form.setError("availability", "");
                                form.setData("redeemAnytime", newValue);

                                // Return true to signify the update was successful.
                                return true;
                            }} />
                    </div>
                    <InputError errorMessage={form.errors?.redeemAnytime} />
                </div>
            }

            {(listingId && form.data.redeemAnytime) &&
                (
                    <div className="col-span-full" >
                        <InputLabel htmlFor="active" name="Redeem Anytime" required={true} />
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            If toggled on, once a creator is approved for this offer they will be able to redeem it within 30 days before it expires.
                            Redeem anytime allows for easier collaboration with creators, allowing you to partner with more high-quality influencers on a regular basis.<br />
                        </p>
                        <p className='mt-1 text-sm leading-6 text-gray-500 italic'>
                            If you require table reservations this may not be suitable for you.
                        </p>
                        <div className="mt-2">
                            <p className='text-sm leading-6 text-gray-600 font-semibold'>This listing is set to redeem anytime.</p>
                        </div>
                    </div>
                )
            }


            {/* Availablity selector */}
            {!form.data.redeemAnytime && (
                <div className="col-span-full">
                    <InputLabel htmlFor="availability" name="Availability" required={true} />
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        Select availability times by clicking on the time slots. You will be able to edit this later on.
                    </p>

                    <div className='mt-1'>
                        <ScheduleSelector defaultValues={defaultValues.availability} onChange={(availability: Availability) => form.setData("availability", availability)} />
                    </div>

                    <InputError errorMessage={form.errors?.availability} />
                </div>
            )}

            {/* Submit */}
            <div className="col-span-full py-6 flex items-center justify-end gap-x-6 border-b border-gray-900/10">

                {submitError &&
                    <InputError errorMessage={submitError} />
                }
                {form.wasSuccessful &&
                    <InputSuccess successMessage={submitSuccess} />
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
                    {submitButtonText}
                </PrimaryButton>
            </div>
        </form>
    )
}