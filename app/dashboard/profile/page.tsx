'use client'

import InputLabel from "@/app/_components/InputLabel";
import InputError from "@/app/_components/InputError";
import InputText from "@/app/_components/InputText";
import PrimaryButton from "@/app/_components/PrimaryButton";
import { useState } from "react";
import { signOut, useSession } from 'next-auth/react'
import { User } from "@prisma/client";
import InputSuccess from "@/app/_components/InputSuccess";
import UpdatePasswordForm from "@/app/_components/UpdatePasswordForm";
import useForm, { Errors } from "@/app/_utils/useForm";
import { useSessionSetEffect } from "@/app/_utils/useSessionSetEffect";

export type UpdateBusinessOwnerFormSchemaType = {
    email: string
    firstName: string
    lastName: string
    phoneNumber: string
}

export default function Page() {

    const { data: session } = useSession();
    const [user, setUser] = useState<User>();
    const [loadingPage, setLoadingPage] = useState<boolean>(true);
    const [submitSuccess, setSubmitSuccess] = useState<string>("");

    const form = useForm<UpdateBusinessOwnerFormSchemaType>({
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        setSubmitSuccess("");

        form.put(`/api/users/business-owners/${user?.id}`, {
            onSuccess: (response: Response) => { onSuccessfullyUpdated(response); },
            onError: (errors: Errors) => { console.error(errors); },
        });
    };


    const onSuccessfullyUpdated = async (response: Response) => {

        const shouldReLogin: boolean = (user?.email !== form.data.email);

        const updateResponseData = await response.json();
        setUser(updateResponseData);

        setSubmitSuccess(`Profile updated!${shouldReLogin ? " Please login again with the new credentials. Redirecting..." : ""}`)

        if (shouldReLogin) {
            await new Promise((resolve) => setTimeout(resolve, 3000));
            signOut();
        }
    };

    const getUser = async () => {

        if (!session?.user?.id) {
            return {}
        }

        const userResponse = await fetch(`/api/users/${session.user.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        if (!userResponse.ok) {
            const data = await userResponse.json();
            console.error(data);
            return {};
        }

        const data = await userResponse.json();
        setUser(data);

        form.setData({
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber,
        })

        setLoadingPage(false);
    };

    useSessionSetEffect(getUser, session);

    return (
        <div>
            {
                loadingPage ? (
                    <div className="w-full py-8 flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                ) :
                    <div className="space-y-12">

                        {/* Edit Profile Info */}
                        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
                            <div className="md:col-span-1">
                                <h2 className="text-base font-semibold leading-7 text-gray-900">Business Profile</h2>
                                <p className="mt-1 text-sm leading-6 text-gray-600">
                                    Edit the general information of your business.
                                </p>
                            </div>

                            <form onSubmit={submit} className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">

                                <div className="col-span-full" >
                                    <InputLabel htmlFor="email" name="Email" required={true} />
                                    <div className="mt-1">
                                        <InputText
                                            name="email"
                                            value={form.data.email}
                                            onChange={e => form.setData('email', e.target.value)}
                                        />
                                    </div>
                                    <InputError errorMessage={form.errors?.email} />
                                </div>

                                <div className="col-span-full">
                                    <InputLabel htmlFor="phoneNumber" name="Phone" required={true} />
                                    <div className="mt-1">
                                        <InputText
                                            name="phoneNumber"
                                            value={form.data.phoneNumber}
                                            onChange={e => form.setData('phoneNumber', e.target.value)}
                                            autoComplete="tel"
                                        />
                                    </div>
                                    <InputError errorMessage={form.errors?.phoneNumber} />
                                </div>

                                <div className="col-span-full sm:col-span-3">
                                    <InputLabel htmlFor="firstName" name="First name" required={true} />
                                    <div className="mt-1">
                                        <InputText
                                            name="firstName"
                                            value={form.data.firstName}
                                            onChange={e => form.setData('firstName', e.target.value)}
                                            autoComplete="given-name"
                                        />
                                    </div>
                                    <InputError errorMessage={form.errors?.firstName} />
                                </div>

                                <div className="col-span-full sm:col-span-3">
                                    <InputLabel htmlFor="lastName" name="Last name" required={true} />
                                    <div className="mt-1">
                                        <InputText
                                            name="lastName"
                                            value={form.data.lastName}
                                            onChange={e => form.setData('lastName', e.target.value)}
                                            autoComplete="family-name"
                                        />
                                    </div>
                                    <InputError errorMessage={form.errors?.lastName} />
                                </div>

                                <div className=" col-span-full py-6 flex items-center justify-end gap-x-6 border-b border-gray-900/10">

                                    {form.wasSuccessful &&
                                        <InputSuccess successMessage={submitSuccess} />
                                    }
                                    {form.hasErrors &&
                                        <InputError errorMessage="Error while updating the business." />
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
                        </div>

                        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
                            <div>
                                <h2 className="text-base font-semibold leading-7 text-gray-900">Change Password</h2>
                                <p className="mt-1 text-sm leading-6 text-gray-600">Update the password for your account.</p>
                            </div>
                            <UpdatePasswordForm user={user || undefined} />
                        </div>
                    </div>
            }
        </div>
    )
}