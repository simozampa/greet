import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import React from 'react';

function SuccessAlert({ title, description }: { title: React.ReactNode, description: React.ReactNode }) {
    return (
        <div className="rounded-md bg-green-50 p-4 mb-8">
            <div className="flex">
                <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                        {title}
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                        {description}
                    </div>
                </div>
            </div>
        </div>
    );
}

function WarningAlert({ title, description }: { title: React.ReactNode, description: React.ReactNode }) {
    return (
        <div className="rounded-md bg-yellow-50 p-4 mb-8">
            <div className="flex">
                <div className="flex-shrink-0">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                        {title}
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                        {description}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ErrorAlert({ title, description }: { title: React.ReactNode, description: React.ReactNode }) {
    return (
        <div className="rounded-md bg-red-50 p-4 mb-8">
            <div className="flex">
                <div className="flex-shrink-0">
                    <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                        {title}
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                        {description}
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoAlert({ title, description }: { title: React.ReactNode, description: React.ReactNode }) {
    return (
        <div className="rounded-md bg-blue-50 p-4 mb-8">
            <div className="flex">
                <div className="flex-shrink-0">
                    <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                        {title}
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                        {description}
                    </div>
                </div>
            </div>
        </div>
    );
}

export const Alert = {
    Success: SuccessAlert,
    Warning: WarningAlert,
    Error: ErrorAlert,
    Info: InfoAlert
};