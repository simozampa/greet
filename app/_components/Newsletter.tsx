'use client'

import InputText from "./InputText";
import PrimaryButton from "./PrimaryButton";
import InputError from "./InputError";
import { useState } from "react";
import InputSuccess from "./InputSuccess";
import { cn } from "../_utils/helpers";
import useForm, { Errors } from "../_utils/useForm";

interface NewsletterProps {
    userType: string,
    color: string,
}

export type JoinNewsletterFormSchemaType = {
    email: string
    userType: string
}

export default function Newsletter({ userType, color }: NewsletterProps) {

    const form = useForm<JoinNewsletterFormSchemaType>({
        email: '',
        userType: userType
    })

    const submit = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        form.post('/api/newsletter-subscribers', {
            onSuccess: (response: Response) => { },
            onError: (errors: Errors) => { console.error(errors); },
        });
    };

    return (

        <div 
            className="relative isolate overflow-hidden px-6 py-24 bg-gradient-to-r sm:rounded-2xl sm:px-24 xl:py-32 bg-gray-50 shadow-2xl border-t-2 border-gray-100">
            <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-logo uppercase">
                Sign up for our newsletter.
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-lg leading-8 text-gray-700">
                Get notified about product news and updates.
            </p>
            <form onSubmit={submit} className="mx-auto mt-10 flex flex-wrap max-w-md gap-x-4">
                <label htmlFor="email-address" className="sr-only">
                    Email address
                </label>
                <InputText className="min-w-0 flex-auto w-full sm:w-auto"
                    id="email-address"
                    type="email"
                    autoComplete="email"
                    required
                    value={form.data.email}
                    onChange={e => form.setData('email', e.target.value)}
                    placeholder="Enter your email" />

                <PrimaryButton
                    type="submit"
                    disabled={form.processing || form.wasSuccessful}
                    className="flex-none w-full mt-4 sm:w-auto sm:mt-0">

                    {form.processing &&
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    }
                    Notify me
                </PrimaryButton>

            </form>
            <div className="mx-auto max-w-md text-center mt-2 sm:text-left">
                <InputError errorMessage={form.errors?.email} />

                {form.recentlySuccessful &&
                    <InputSuccess successMessage="Subscribed successfully!" />
                }
            </div>


            <svg
                viewBox="0 0 1024 1024"
                className="hidden lg:block absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2"
                aria-hidden="true"
            >
                <circle cx={512} cy={512} r={512} fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
                <defs>
                    <radialGradient
                        id="759c1415-0410-454c-8f7c-9a820de03641"
                        cx={0}
                        cy={0}
                        r={1}
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(512 512) rotate(90) scale(512)"
                    >
                        <stop stopColor={`var(--color-${color}-500)`} />
                        <stop offset={1} stopColor={`var(--color-${color}-500)`} stopOpacity={0} />
                    </radialGradient>
                </defs>
            </svg>
        </div>
    )
}