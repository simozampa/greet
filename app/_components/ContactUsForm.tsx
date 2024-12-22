'use client';

import InputError from '@/app/_components/InputError';
import InputLabel from '@/app/_components/InputLabel';
import InputSuccess from '@/app/_components/InputSuccess';
import InputText from '@/app/_components/InputText';
import InputTextArea from '@/app/_components/InputTextArea';
import PrimaryButton from '@/app/_components/PrimaryButton'
import useForm, { Errors } from '../_utils/useForm';

export type ContactUsFormSchemaType = {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    message: string
}

export default function ContactUsForm() {

    const form = useForm<ContactUsFormSchemaType>({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        message: '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        form.post("/api/contact-requests", {
            onSuccess: (response: Response) => { },
            onError: (errors: Errors) => { console.error(errors); },
        });
    };

    return (
        <form onSubmit={submit} className="px-6 lg:px-8">
            <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="firstName" name="First name" required={true} />
                        <div className="mt-1">
                            <InputText
                                name="firstName"
                                value={form.data.firstName}
                                onChange={e => form.setData('firstName', e.target.value)}
                                autoComplete="given-name"
                            />
                        </div>
                        <InputError errorMessage={form.errors?.firstName} />
                    </div>
                    <div>
                        <InputLabel htmlFor="lastName" name="Last name" required={true} />
                        <div className="mt-1">
                            <InputText
                                name="lastName"
                                value={form.data.lastName}
                                onChange={e => form.setData('lastName', e.target.value)}
                                autoComplete="family-name"
                            />
                        </div>
                        <InputError errorMessage={form.errors?.lastName} />
                    </div>
                    <div className="sm:col-span-2">
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
                    <div className="sm:col-span-2">
                        <InputLabel htmlFor="phoneNumber" name="Phone" required={true} />
                        <div className="mt-1">
                            <InputText
                                name="phoneNumber"
                                value={form.data.phoneNumber}
                                onChange={e => form.setData('phoneNumber', e.target.value)}
                                autoComplete="tel"
                            />
                        </div>
                        <InputError errorMessage={form.errors?.phoneNumber} />
                    </div>
                    <div className="sm:col-span-2">
                        <InputLabel htmlFor="message" name="Message" required={true} />
                        <div className="mt-1">
                            <InputTextArea
                                name="message"
                                value={form.data.message}
                                onChange={e => form.setData('message', e.target.value)}
                            />
                        </div>
                        <InputError errorMessage={form.errors?.message} />
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-end">

                    <div className="w-auto flex-1">
                        {form.hasErrors &&
                            <InputError errorMessage="Error sending messsage." />
                        }
                        {form.wasSuccessful &&
                            <InputSuccess successMessage="Thank you for contacting us. You will hear back from us shortly." />
                        }
                    </div>

                    <PrimaryButton
                        type="submit"
                        disabled={form.processing || form.wasSuccessful}
                    >
                        {form.processing &&
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        }
                        Send message
                    </PrimaryButton>
                </div>
            </div>
        </form>
    )
}
