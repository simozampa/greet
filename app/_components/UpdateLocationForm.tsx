'use client'

import React, { useState } from 'react'
import { Location } from '@prisma/client'
import InputLabel from './InputLabel'
import InputText from './InputText'
import InputError from './InputError'
import InputSelect from './InputSelect'
import { countries } from '../_utils/constants'
import PrimaryButton from './PrimaryButton'
import InputSuccess from './InputSuccess'
import useForm from '../_utils/useForm'

export type UpdateLocationFormSchemaType = {
    name?: string
    phoneNumber: string
    street: string
    city: string
    country: string
    region: string
    postalCode: string
}

interface UpdateLocationFormProps {
    location: Location
}

export default function UpdateLocationForm({ location }: UpdateLocationFormProps) {

    const form = useForm<UpdateLocationFormSchemaType>({
        name: location.name ? location.name : '',
        phoneNumber: location.phoneNumber,
        street: location.street,
        city: location.city,
        country: location.country,
        region: location.region,
        postalCode: location.postalCode,
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        form.put(`/api/businesses/${location.businessId}/locations/${location.id}`);
    };

    return (
        <form onSubmit={submit} className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">

            {/* Name */}
            <div className="col-span-full">
                <InputLabel htmlFor="name" name="Location Name" />
                <div className="mt-1">
                    <InputText
                        name="name"
                        value={form.data.name}
                        onChange={e => form.setData('name', e.target.value)}
                        placeholder="Example: Sam's Pizza - 123 Main street"
                    />
                </div>
                <span
                    className='text-gray-500 mt-1 text-xs'
                >
                    Leave this empty if same as Business Name.
                </span>
                <InputError errorMessage={form.errors?.name} />
            </div>

            {/* Phone Number */}
            <div className="col-span-full">
                <InputLabel htmlFor="phoneNumber" name="Phone Number" required={true} />
                <div className="mt-1">
                    <InputText
                        name="phoneNumber"
                        value={form.data.phoneNumber}
                        onChange={e => form.setData('phoneNumber', e.target.value)}
                    />
                </div>
                <InputError errorMessage={form.errors?.phoneNumber} />
            </div>


            {/* Street */}
            <div className="col-span-full">
                <InputLabel htmlFor="street" name="Street" required={true} />
                <div className="mt-1">
                    <InputText
                        name="street"
                        value={form.data.street}
                        onChange={e => form.setData('street', e.target.value)}
                        autoComplete="street-address" />
                </div>
                <InputError errorMessage={form.errors?.street} />
            </div>


            {/* City */}
            <div className="sm:col-span-3">
                <InputLabel htmlFor="city" name="City" required={true} />
                <div className="mt-1">
                    <InputText
                        name="city"
                        value={form.data.city}
                        onChange={e => form.setData('city', e.target.value)}
                        autoComplete="address-level2"
                    />
                </div>
                <InputError errorMessage={form.errors?.city} />
            </div>


            {/* Country */}
            <div className="sm:col-span-3">
                <InputLabel htmlFor="country" name="Country" required={true} />
                <div className="mt-1">
                    <InputSelect
                        name="country"
                        value={form.data.country}
                        onChange={e => form.setData('country', e.target.value)}
                        options={countries}
                        autoComplete="country-name"
                    />
                </div>
                <InputError errorMessage={form.errors?.country} />
            </div>

            {/* Region */}
            <div className="sm:col-span-3">
                <InputLabel htmlFor="region" name="State / Province" required={true} />
                <div className="mt-1">
                    <InputText
                        name="region"
                        value={form.data.region}
                        onChange={e => form.setData('region', e.target.value)}
                        autoComplete="address-level1"
                    />
                </div>
                <InputError errorMessage={form.errors?.region} />
            </div>

            {/* Postal Code */}
            <div className="sm:col-span-3">
                <InputLabel htmlFor="postalCode" name="Postal Code" required={true} />
                <div className="mt-1">
                    <InputText
                        name="postalCode"
                        value={form.data.postalCode}
                        onChange={e => form.setData('postalCode', e.target.value)}
                        autoComplete="postal-code" />
                </div>
                <InputError errorMessage={form.errors?.postalCode} />
            </div>
            <div className="col-span-full py-6 flex items-center justify-end gap-x-6 border-b border-gray-900/10">

                {form.hasErrors &&
                    <InputError errorMessage="Erorr while updating the location." />
                }

                {form.recentlySuccessful &&
                    <InputSuccess successMessage="Location updated!" />
                }

                <PrimaryButton
                    disabled={form.processing}
                    type="submit"
                >
                    {form.processing &&
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    }
                    Save
                </PrimaryButton>
            </div>
        </form>
    )
}