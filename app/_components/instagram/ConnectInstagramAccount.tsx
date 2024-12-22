'use client';

import Script from 'next/script';
import { cn } from '../../_utils/helpers';
import { Fragment, useState } from 'react'
import { InstagramAccount } from '@prisma/client';
import { createInstagramAccount } from '../../actions';
import { Dialog, Transition } from '@headlessui/react'
import { useMountEffect } from '../../_utils/useMountEffect';
import { initFacebookSdk, fbLogin } from '@/app/_utils/instagram/facebook';
import { FacebookAuthResponse } from '../../_utils';

import InputError from '../InputError';
import LoadingIcon from '../LoadingIcon';
import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';


interface ConnectInstagramAccountProps {
    initialValue: InstagramAccount | undefined,
    userId: string,
    originalHandle: string,
    onConnect?: ((data: InstagramAccount) => void);
    onDisconnect?: (() => void);
};

export default function ConnectInstagramAccount({ initialValue, userId, originalHandle, onConnect, onDisconnect }: ConnectInstagramAccountProps) {

    const [currentPages, setCurrentPages] = useState([]);
    const [selectedPage, setSelectedPage] = useState<any>();
    const [userAccessToken, setUserAccessToken] = useState<string>("");
    const [showSelectPageModal, setShowSelectPageModal] = useState<boolean>(false);
    const [currentAccount, setCurrentAccount] = useState<InstagramAccount | undefined>(initialValue);

    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [modalErrorMessage, setModalErrorMessage] = useState<string>("");

    const connectInstagram = async () => {

        setErrorMessage("");

        try {
            const response: FacebookAuthResponse = await fbLogin();
            if (response.status !== "connected") {
                setErrorMessage("Could not login into Facebook. Please try again later.");
                return;
            }

            await displayPageSelectionModal(response.authResponse.accessToken);

        } catch (error) {
            console.error(error);
            initFacebookSdk().then(() => connectInstagram())
        }
    };

    const displayPageSelectionModal = async (accessToken: string) => {

        // Get all the pages
        // GET /me/accounts
        const pagesResponse = await fetch(`https://graph.facebook.com/v17.0/me/accounts?access_token=${accessToken}&summary=total_count`, {
            method: 'GET'
        });

        if (!pagesResponse.ok) {
            setErrorMessage("Could not get pages for your Facebook account. Please try again later.");
            return;
        }

        const pages = await pagesResponse.json();

        setUserAccessToken(accessToken);
        setCurrentPages(pages.data);

        // Prepare the modal
        setModalErrorMessage("");
        setShowSelectPageModal(true)
    }

    const onPageSelected = async () => {

        if (!selectedPage) {
            setModalErrorMessage("Please select a page from the list.");
            return;
        }

        setLoading(true);

        const { isValid, instagramAccount, error } = await createInstagramAccount(
            selectedPage.id,
            selectedPage.access_token,
            userAccessToken,
            userId,
            originalHandle
        );

        if (!isValid) {
            setErrorMessage(error);
            setLoading(false);
            closeModal();
            return;
        }

        if (!instagramAccount) {
            setErrorMessage("Error while verifying the Instagram Account. Please try again later. If the problem persists, please contact us at info@greet.club");
            setLoading(false);
            closeModal();
            return;
        }

        if (onConnect) onConnect(instagramAccount);
        setCurrentAccount(instagramAccount);

        setLoading(false)
        setShowSelectPageModal(false);
    }

    const closeModal = () => {

        if (loading) return;

        setShowSelectPageModal(false);
        setCurrentPages([]);
        setSelectedPage(undefined);
        setUserAccessToken("");
        setModalErrorMessage("");
    };

    const removeAccount = async () => {
        if (!currentAccount) { return; }

        // await fbLogout()

        if (onDisconnect) {
            onDisconnect();
        }
    };

    useMountEffect(() => { initFacebookSdk() })

    return (
        <>
            <Script
                src="https://connect.facebook.net/en_US/sdk.js" />
            <Transition.Root show={showSelectPageModal} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                                    <div>
                                        <Dialog.Title as="h3" className="text-base font-semibold text-gray-900">
                                            Select Page
                                        </Dialog.Title>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Please select from the list below the page associated with your Instagram Creator Account.
                                            If you don&apos;t see the page in this list, connect the page on Instagram (Profile &gt; Edit Profile &gt; Page ), close
                                            this dialog, and try again.
                                        </p>
                                        <fieldset className="mt-2">
                                            <div className="divide-y divide-gray-200">
                                                {currentPages.length > 0 ?
                                                    currentPages.map((page: any, index: number) => (
                                                        <div key={page.id} className="relative flex items-start pb-4 pt-3.5">
                                                            <div className="min-w-0 flex-1 text-sm leading-6">
                                                                <label htmlFor={`account-${page.id}`} className="font-medium text-gray-900">
                                                                    {page.name}
                                                                </label>
                                                                <p id={`account-${page.id}-description`} className="text-gray-500">
                                                                    {page.category}
                                                                </p>
                                                            </div>
                                                            <div className="ml-3 flex h-6 items-center">
                                                                <input
                                                                    id={`account-${page.id}`}
                                                                    aria-describedby={`account-${page.id}-description`}
                                                                    name="account"
                                                                    type="radio"
                                                                    onChange={() => setSelectedPage(page)}
                                                                    className="h-4 w-4 border-gray-300 text-gray-900 focus:ring-gray-900"
                                                                />
                                                            </div>
                                                        </div>
                                                    ))
                                                    : (
                                                        <p className="mt-4 text-sm text-gray-500">
                                                            <strong>No pages found in your Facebook account.</strong><br />
                                                            Learn how create a Facebook Page and connect your Instagram Creator account to it <a className="underline hover:text-gray-900 font-semibold" target="_blank" href="https://help.instagram.com/570895513091465/?cms_platform=www&helpref=platform_switcher">here</a>.<br />
                                                            If you're still experiencing any issues, please contact us at info@greet.club
                                                        </p>
                                                    )}

                                            </div>
                                        </fieldset>
                                    </div>
                                    <InputError errorMessage={modalErrorMessage} />
                                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                                        <SecondaryButton
                                            onClick={closeModal}
                                        >
                                            Cancel
                                        </SecondaryButton>
                                        {currentPages.length > 0 && (
                                            <PrimaryButton
                                                onClick={() => onPageSelected()}
                                                disabled={loading}
                                            >
                                                Select
                                                {loading && (
                                                    <LoadingIcon iconSize="h-4 w-4" textColor="text-white" />
                                                )}
                                            </PrimaryButton>
                                        )}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>

            <div>
                <button
                    type='button'
                    className={cn(
                        "w-full py-2 flex items-center justify-center text-center rounded-md bg-white px-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-900 hover:bg-gray-50",
                        currentAccount ? 'hover:bg-gray-200 bg-gray-200' : ''
                    )}
                    disabled={(currentAccount) ? true : false} onClick={connectInstagram}
                >

                    {currentAccount ? (
                        <span className='truncate'>Connected as @{currentAccount.username}</span>
                    ) : (
                        <>
                            <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                            </svg>
                            <span>Continue with Facebook</span>
                        </>
                    )}

                </button >

                {/* {currentAccount &&
                    <button
                        type='button'
                        onClick={() => removeAccount()} className='mt-2 w-full py-2 flex items-center justify-center text-center rounded-md bg-white px-2.5 text-sm font-semibold text-red-500 shadow-sm ring-1 ring-inset ring-red-500 hover:bg-red-50'
                    >
                        <XMarkIcon className='w-5 h-5 mr-2' />
                        <span>Disconnect account</span>
                    </button>
                } */}
            </div>
            <InputError errorMessage={errorMessage} />
        </>
    )
}



