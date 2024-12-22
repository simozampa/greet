'use client'

import { Fragment, useEffect } from 'react'
import { Transition } from '@headlessui/react'

interface ModalProps {
    show: boolean
    onClose: () => void
    children: React.ReactNode
}

export default function Modal({ show, onClose, children }: ModalProps) {

    useEffect(() => {
        if (!show) onClose();
    }, [show]);

    return (
        <>
            <Transition.Root show={show} as={Fragment}>
                <div className="absolute inset-0 w-full h-[calc(100vh-4rem)] z-20 overflow-y-auto"> {/* 4rem = navbar */}
                    <div className="relative w-full h-full flex justify-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <div className="z-30 px-4 py-6 lg:pt-10 transition-all overflow-y-auto">
                                {children}
                            </div>
                        </Transition.Child>

                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            {/* Background */}
                            <div onClick={() => onClose()} className="absolute backdrop-blur-sm transition-all w-full h-full z-20" />
                        </Transition.Child>
                    </div>
                </div>
            </Transition.Root>
        </>
    )
}