'use client'

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from 'next-auth/react'
import { deleteInstagramVerification, getInstagramVerification } from "@/app/actions";
import { InstagramAccount, InstagramVerification } from "@prisma/client";
import LoadingIcon from "@/app/_components/LoadingIcon";
import ConnectInstagramAccount from "@/app/_components/instagram/ConnectInstagramAccount";
import InputSuccess from "@/app/_components/InputSuccess";
import PrimaryButton from "@/app/_components/PrimaryButton";
import Link from "next/link";



export default function Page({ params }: { params: { token: string } }) {

    const { data: session, update } = useSession();
    const [loadingPage, setLoadingPage] = useState<boolean>(true);
    const [connectedMessage, setConnectedMessage] = useState<string>("");
    const [instagramVerification, setInstagramVerification] = useState<InstagramVerification | null>(null);

    const handleConnected = async (instagramAccount: InstagramAccount) => {

        await deleteInstagramVerification(instagramVerification);

        if (session) {
            await update();
        }

        setConnectedMessage("Instagram Account verified successfully! Redirecting...")

        await new Promise<void>((resolve) => {
            setTimeout(() => {
              resolve();
            }, 2000); // 2000 milliseconds = 2 seconds
          });

        window.location.replace('/listings')
    };

    useEffect(() => {

        const getVerification = async () => {

            setLoadingPage(true);

            setInstagramVerification(await getInstagramVerification(params.token));

            setLoadingPage(false);
        };

        getVerification();

    }, []);

    return (
        <>
            {loadingPage ? (
                <div className="w-full py-8 lg:py-16">
                    <div className="h-[24rem] mx-auto max-w-2xl p-4 lg:p-8 bg-gray-100 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2 animate-pulse" />
                </div>
            ) : (
                <>
                    {instagramVerification ? (
                        <div className="w-full py-8 lg:py-16">

                            <div className="mx-auto max-w-2xl p-4 lg:p-8 bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">

                                {/* Section Header */}
                                <div className="py-8">
                                    <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900 text-center">
                                        Verify Your Instagram Account
                                    </h2>
                                    <p className="mt-1 text-sm leading-6 text-gray-700 text-center">
                                        Follow the instruction below to verify your instagram account before getting started with Greet!
                                    </p>
                                </div>

                                <p className="mt-1 text-sm leading-6 text-gray-600">
                                    Connect your Instagram Creator account to verify you are the owner of the account. <br />
                                    Before getting started, make sure that your Instagram Creator account is connected to a Facebook Page.<br />
                                    This is a required step by Instagram to help us verify that you are the real owner of your account.<br />
                                    Learn how to connect your Facebook account to your Instagram account <a className="underline hover:text-gray-900 font-semibold" target="_blank" href="https://greetclubapp.notion.site/Connecting-your-IG-and-FB-a11817692d964dad87c1bf8d1efe8fea?pvs=4">here</a>.<br />
                                    Then, simply proceed by loggining in with your Facebook account below.
                                </p>
                                <p className="mt-2 text-sm leading-6 text-gray-600">
                                    <strong className="text-red-500">NOTE: </strong> you must connect the Instagram Account you provided during registration (<strong>@{instagramVerification.handle}</strong>).
                                    For any problem during the connection process contact us at info@greet.club
                                </p>

                                <div className="mt-4">
                                    <ConnectInstagramAccount
                                        initialValue={undefined}
                                        userId={instagramVerification.userId}
                                        originalHandle={instagramVerification.handle}
                                        onConnect={handleConnected}
                                    />
                                </div>

                                {connectedMessage && (
                                    <div className="mt-2">
                                        <InputSuccess successMessage={connectedMessage} />
                                        <div className="flex justify-end">
                                            <div className="flex space-x-2">
                                                <span className="text-sm text-gray-500">or</span>
                                                <a href="/listings">
                                                    <PrimaryButton
                                                        type="button"
                                                    >
                                                        Continue to Greet
                                                    </PrimaryButton>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className='my-16 py-16 lg:py-32 px-8 lg:px-16'>
                                {/* Title and Description */}
                                <div className='text-center first-letter:py-4 max-w-md mx-auto'>
                                    <h1 className='text-5xl font-semibold text-gray-900'>Expired Link</h1>
                                    <p className='text-xl text-gray-700 mt-4'>If you think this is a mistake, please contact us at info@greet.club</p>
                                </div>
                                {/* Sing in and Sign up Buttons */}
                                <div className='flex items-center justify-center space-x-4 pt-8'>
                                    <Link href="/login">
                                        <PrimaryButton className='px-8 lg:px-14 py-4'>
                                            Continue
                                        </PrimaryButton>
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </>
    )
};