'use client'

import { useRouter } from "next/navigation"
import { ApprovalStatus } from '@prisma/client'
import React, { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { updateBusinessApprovalStatus } from "@/app/actions"
import { approvalStatusBadges } from '../../_utils/constants'
import { cn, getApprovalStatusBadge } from '../../_utils/helpers'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

import ConfirmationModal from '../ConfirmationModal'


interface BusinessApprovalStatusSelectProps {
    status: ApprovalStatus
    businessId: string
}

export default function BusinessApprovalStatusSelect({ status, businessId }: BusinessApprovalStatusSelectProps) {

    const router = useRouter();

    const [showModal, setShowModal] = useState<boolean>(false);
    const [selected, setSelected] = useState<ApprovalStatus>(status);
    const [loading, setLoading] = useState<boolean>(false);

    async function changeStatus() {

        setLoading(true);

        await updateBusinessApprovalStatus(businessId, selected);

        setLoading(false);
        setShowModal(false);

        router.refresh();
    }

    return (
        <>
            <ConfirmationModal
                show={showModal}
                loading={loading}
                onConfirm={changeStatus}
                onCancel={() => setShowModal(false)}
                iconClass="bg-yellow-100 text-yellow-600"
                title="Update Business Approval Status"
                description="Updating a business approval status will automatically send an email (if approving or rejecting) to all the users connected to the business, and automatically approve all them as well. Are you sure you want to continue?"
                buttonText="Update"
                cssButton="bg-gray-900 hover:bg-gray-700"
            />
            <Listbox value={status} onChange={(status: ApprovalStatus) => {
                setSelected(status);
                setShowModal(true);
            }}>
                {({ open }) => (
                    <>
                        <div className="relative">
                            <Listbox.Button className="relative cursor-pointer rounded-md bg-white py-1.5 text-left pr-8 text-gray-900 sm:text-sm sm:leading-6">
                                {getApprovalStatusBadge(status)}
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </span>
                            </Listbox.Button>

                            <Transition
                                show={open}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options className="absolute z-10 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {approvalStatusBadges.map((badge) => (
                                        <Listbox.Option
                                            key={badge.status}
                                            className={({ active }) =>
                                                cn(
                                                    active ? 'bg-gray-100' : '',
                                                    'relative cursor-pointer select-none py-2 pl-3 pr-9'
                                                )
                                            }
                                            value={badge.status}
                                        >
                                            {({ selected, active }) => (
                                                <>
                                                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${badge.class}`}>
                                                        {badge.name}
                                                    </span>

                                                    {selected ? (
                                                        <span
                                                            className={cn(
                                                                active ? '' : 'text-gray-900',
                                                                'absolute inset-y-0 right-0 flex items-center pr-4'
                                                            )}
                                                        >
                                                            <CheckIcon className="h-4 w-4" aria-hidden="true" />
                                                        </span>
                                                    ) : null}
                                                </>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </>
                )}
            </Listbox>
        </>

    )
}