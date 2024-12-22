'use client'

import { useState } from "react";
import { useSession } from 'next-auth/react'
import { deleteInstagramVerification } from "@/app/actions";
import { InstagramAccount, InstagramVerification } from "@prisma/client";

import InputSuccess from "../InputSuccess";
import ConnectInstagramAccount from "./ConnectInstagramAccount";
import PrimaryButton from "../PrimaryButton";


export default function InstagramVerificationForm({ instagramVerification }: { instagramVerification: InstagramVerification }) {

    const { data: session, update } = useSession();
    const [connectedMessage, setConnectedMessage] = useState<string>("");

    const handleConnected = async (instagramAccount: InstagramAccount) => {

        await deleteInstagramVerification(instagramVerification);

        setConnectedMessage("Instagram Account verified successfully!")

        if (session) {
            update();
        }
    };

    return (
        <>
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
                        Learn how to connect a Facebook Page to your Instagram Creator account <a className="underline hover:text-gray-900 font-semibold" target="_blank" href="https://help.instagram.com/570895513091465/?cms_platform=www&helpref=platform_switcher">here</a>.<br />
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
                                <a href="/listings">
                                    <PrimaryButton
                                        type="button"
                                    >
                                        Continue to Greet
                                    </PrimaryButton>
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
};