'use client'

import { useRef } from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import LoadingIcon from './LoadingIcon'
import { cn } from '../_utils/helpers'
import Modal from './Modal'

interface ConfirmationModalProps {
    show: boolean
    loading: boolean
    onConfirm: () => void
    onCancel: () => void
    iconClass: string
    title: string
    description: string
    buttonText: string
    cssButton: string
}

export default function ConfirmationModal({ show, loading, onConfirm, onCancel, iconClass, title, description, buttonText, cssButton }: ConfirmationModalProps) {

    const cancelButtonRef = useRef(null)

    return (
        <>
            <Modal show={show} onClose={onCancel}>
                <div className="bg-gray-50 transform overflow-hidden rounded-lg px-4 pb-4 pt-5 text-left shadow-xl ring-1 ring-gray-200 transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                    <div className="sm:flex sm:items-start">
                        <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 ${iconClass}`}>
                            <ExclamationTriangleIcon className="h-6 w-6 " aria-hidden="true" />
                        </div>
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                            <h3 className="text-base font-semibold leading-6 text-gray-900">
                                {title}
                            </h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                    {description}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            className={cn(`inline-flex w-full justify-center rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-900 sm:ml-3 sm:w-auto`, cssButton)}
                            onClick={onConfirm}
                        >
                            {buttonText}
                            {loading &&
                                <LoadingIcon textColor='text-white' iconSize='w-4 h-4' />
                            }
                        </button>
                        <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            onClick={onCancel}
                            ref={cancelButtonRef}
                        >
                            Back
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    )
}