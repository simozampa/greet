"use client"

import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react"
import { useSession } from 'next-auth/react'
import InputLabel from "@/app/_components/InputLabel";
import InputText from "@/app/_components/InputText";
import InputError from "@/app/_components/InputError";
import PrimaryButton from "@/app/_components/PrimaryButton";
import { cn, loginRedirect } from "@/app/_utils/helpers";
import Link from "next/link";
import useForm from "@/app/_utils/useForm";

export type LoginFormSchemaType = {
    email: string
    password: string
}


export default function Page() {

    const [submitError, setSubmitError] = useState<string>("");
    const form = useForm<LoginFormSchemaType>({
        email: '',
        password: '',
    })

    const { data: session, status } = useSession();


    const submit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        setSubmitError("");
        form.setProcessing(true);

        try {

            const result = await signIn("credentials", {
                redirect: false,
                ...form.data
            });

            if (result?.error) {
                setSubmitError(result.error);
            }

            form.setProcessing(false);

        } catch (error: any) {
            setSubmitError("Error while logging in. Please try again later.");
            form.setProcessing(false);
        }
    };

    useEffect(() => {
        if (status === "authenticated") {
            loginRedirect(session);
        }
    }, [status, session]);

    return (
        <div className="w-full py-8 lg:py-16">

            <form onSubmit={submit} className="mx-auto max-w-2xl p-4 lg:p-8 bg-white md:shadow-sm md:ring-1 md:ring-gray-900/5 rounded-xl md:col-span-2">

                {/* Section Header */}
                <div className="py-4">
                    <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900 text-center">
                        Sign in
                    </h2>
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

                    {/* Password */}
                    <div className="col-span-full" >
                        <InputLabel htmlFor="password" name="Password" required={true} />
                        <div className="mt-1">
                            <InputText
                                type="password"
                                name="password"
                                value={form.data.password}
                                onChange={e => form.setData('password', e.target.value)}
                            />
                        </div>
                        <InputError errorMessage={form.errors?.password} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                            />
                            <label htmlFor="remember-me" className="ml-3 block text-sm leading-6 text-gray-900">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm leading-6">
                            <Link href="/forgot-password" className="font-semibold text-gray-900 hover:text-gray-600">
                                Forgot password?
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-8">

                    <InputError errorMessage={submitError} className="mt-0" />

                    <div className="flex justify-end">
                        <PrimaryButton
                            type="submit"
                            className={cn("w-full", submitError ? 'mt-2' : '')}
                            disabled={form.processing}
                        >
                            {form.processing &&
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            }
                            Login
                        </PrimaryButton>
                    </div>
                </div>
            </form>
        </div>
    )
}