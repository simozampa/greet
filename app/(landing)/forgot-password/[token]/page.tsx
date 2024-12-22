'use client';

import InputError from "@/app/_components/InputError";
import InputLabel from "@/app/_components/InputLabel";
import InputSuccess from "@/app/_components/InputSuccess";
import InputText from "@/app/_components/InputText";
import PrimaryButton from "@/app/_components/PrimaryButton";
import useForm, { Errors } from "@/app/_utils/useForm";
import { ForgotPasswordRequest } from "@prisma/client";
import { useEffect, useState } from "react";

export type ResetPasswordFormSchemaType = {
    password: string
    confirmPassword: string
}

export default function Page({ params }: { params: { token: string } }) {

    const [loadingPage, setLoadingPage] = useState<boolean>(true);
    const [forgotPasswordRequest, setForgotPasswordRequest] = useState<ForgotPasswordRequest>();

    const form = useForm<ResetPasswordFormSchemaType>({
        password: '',
        confirmPassword: '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        form.transform((data: ResetPasswordFormSchemaType) => ({
            ...data,
            token: params.token,
        }));

        form.put("/api/forgot-password-requests", {
            onSuccess: async (response: Response) => { },
            onError: (errors: Errors) => { console.error(errors); },
        })
    }

    useEffect(() => {

        const getForgotPasswordRequest = async () => {

            setLoadingPage(true);
    
            if (!params.token) {
                setLoadingPage(false);
                return {}
            }
    
            const response = await fetch(`/api/forgot-password-requests?token=${params.token}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            if (!response.ok) {
                setLoadingPage(false);
                return {};
            }
    
            const data = await response.json();
    
            setForgotPasswordRequest(data)
            setLoadingPage(false);
        };
        
        getForgotPasswordRequest();

    }, [params.token]);

    return (
        <>

            {loadingPage ? (
                <div className="w-full py-8 flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            ) :
                (<>

                    {forgotPasswordRequest ? (
                        <div className="w-full py-8 lg:py-16">

                            <div className="mx-auto max-w-2xl p-4 lg:p-8 bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">

                                {/* Section Header */}
                                <div className="py-8">
                                    <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900 text-center">
                                        Reset your Password
                                    </h2>
                                    <p className="mt-1 text-sm leading-6 text-gray-600 text-center">Setup your new password for the account.</p>
                                </div>

                                <form onSubmit={submit}>
                                    <div className="grid grid-cols-1 gap-y-4" >

                                        {/* Password */}
                                        < div className="col-span-full" >
                                            <InputLabel htmlFor="password" name="Password" required={true} />
                                            <div className="mt-1">
                                                <InputText
                                                    type="password"
                                                    value={form.data.password}
                                                    onChange={e => form.setData('password', e.target.value)}
                                                />
                                            </div>
                                            <InputError errorMessage={form.errors?.password} />
                                        </div >

                                        {/* Confirm Password */}
                                        <div className="col-span-full" >
                                            <InputLabel htmlFor="confirmPassword" name="Confirm Password" required={true} />
                                            <div className="mt-1">
                                                <InputText
                                                    type="password"
                                                    value={form.data.confirmPassword}
                                                    onChange={e => form.setData('confirmPassword', e.target.value)}
                                                />
                                            </div>
                                            <InputError errorMessage={form.errors?.confirmPassword} />
                                        </div >
                                    </div >

                                    {/* Footer */}
                                    <div className="mt-8 flex justify-end items-center space-x-2" >

                                        {form.hasErrors &&
                                            <InputError errorMessage="Errors resetting password." />
                                        }

                                        {form.wasSuccessful &&
                                            <InputSuccess successMessage="Password reset successfully!" />
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
                                            Save
                                        </PrimaryButton>
                                    </div >
                                </form>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p>Invalid request.</p>
                        </>
                    )}</>)
            }
        </>
    )
};