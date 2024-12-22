'use client'

import React from 'react'
import InputLabel from './InputLabel'
import InputText from './InputText'
import InputError from './InputError'
import PrimaryButton from './PrimaryButton'
import InputSuccess from './InputSuccess'
import { User } from '@prisma/client'
import { signOut } from "next-auth/react"
import useForm, { Errors } from "../_utils/useForm"

interface UpdatePasswordFormProps {
    user: User | undefined
}

export type UpdateUserPasswordFormSchemaType = {
    oldPassword: string
    newPassword: string
    confirmNewPassword: string
}

export default function UpdatePasswordForm({ user }: UpdatePasswordFormProps) {

    const form = useForm<UpdateUserPasswordFormSchemaType>({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        form.put(`/api/users/${user?.id}/update-password`, {
            onSuccess: async (response: Response) => {
                await new Promise((resolve) => setTimeout(resolve, 3000));
                signOut();
            },
            onError: (errors: Errors) => { console.error(errors); },
        })
    };

    return (
        <form onSubmit={submit} className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">

            {/* Old Password */}
            < div className="col-span-full" >
                <InputLabel htmlFor="oldPassword" name="Old Password" required={true} />
                <div className="mt-1">
                    <InputText
                        type="password"
                        name="oldPassword"
                        value={form.data.oldPassword}
                        onChange={e => form.setData('oldPassword', e.target.value)}
                    />
                </div>
                <InputError errorMessage={form.errors?.oldPassword} />
            </div >

            <div className="col-span-full" >
                <InputLabel htmlFor="newPassword" name="New Password" required={true} />
                <div className="mt-1">
                    <InputText
                        type="password"
                        name="newPassword"
                        value={form.data.newPassword}
                        onChange={e => form.setData('newPassword', e.target.value)}
                    />
                </div>
                <InputError errorMessage={form.errors?.newPassword} />
            </div >

            {/* Confirm Password */}
            < div className="col-span-full" >
                <InputLabel htmlFor="confirmNewPassword" name="Confirm New Password" required={true} />
                <div className="mt-1">
                    <InputText
                        type="password"
                        name="confirmNewPassword"
                        value={form.data.confirmNewPassword}
                        onChange={e => form.setData('confirmNewPassword', e.target.value)}
                    />
                </div>
                <InputError errorMessage={form.errors?.confirmNewPassword} />
            </div >

            <div className="col-span-full py-6 flex items-center justify-end gap-x-6 border-b border-gray-900/10">

                {form.hasErrors &&
                    <InputError errorMessage="Error while updating password." />
                }

                {form.recentlySuccessful &&
                    <InputSuccess successMessage="Password updated! Please login again with the new credentials. Redirecting..." />
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