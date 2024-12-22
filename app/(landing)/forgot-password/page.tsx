"use client"

import React from "react";
import InputLabel from "@/app/_components/InputLabel";
import InputText from "@/app/_components/InputText";
import InputError from "@/app/_components/InputError";
import PrimaryButton from "@/app/_components/PrimaryButton";
import { cn } from "@/app/_utils/helpers";
import InputSuccess from "@/app/_components/InputSuccess";
import useForm, { Errors } from "@/app/_utils/useForm";

export type ForgotPasswordFormSchemaType = {
    email: string
    password?: string
}

export default function Page() {

    const form = useForm<ForgotPasswordFormSchemaType>({
        email: '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        form.post("/api/forgot-password-requests", {
            onSuccess: async (response: Response) => { },
            onError: (errors: Errors) => { console.error(errors); },
        })
    }

    return (
        <div className="w-full py-8 lg:py-16">

            <form onSubmit={submit} className="mx-auto max-w-2xl p-4 lg:p-8 bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">

                {/* Section Header */}
                <div className="py-8">
                    <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900 text-center">
                        Forgot Password
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600 text-center">You are not alone. We&apos;ve all been here at some point.</p>
                </div>

                <div className="grid grid-cols-1 gap-y-4" >
                    {/* Email */}
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
                </div>

                <div className="mt-8">

                    {form.wasSuccessful &&
                        <InputSuccess successMessage="An email has been sent to your inbox. Please click the link when you get it." />
                    }

                    <div className="flex justify-end">
                        <PrimaryButton
                            type="submit"
                            className={cn("w-full", form.wasSuccessful ? 'mt-2' : '')}
                            disabled={form.processing}
                        >
                            {form.processing &&
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            }
                            Send
                        </PrimaryButton>
                    </div>
                </div>
            </form>
        </div>
    )
}