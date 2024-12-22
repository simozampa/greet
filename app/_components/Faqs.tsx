'use client'

import { Disclosure } from '@headlessui/react'
import { MinusSmallIcon, PlusSmallIcon } from '@heroicons/react/24/outline'

// To avoid typescript error
type FaqSection = "Influencers" | "How it works";

interface FaqItem {
    question: string;
    answer: string;
}

interface Faqs {
    [key: string]: FaqItem[];
}

const faqs: Faqs = {
    "Influencers": [
        {
            question: "What type of influencers do you work with?",
            answer:
                "Lifestyle, Food, Fashion, Humor, MakeUp, Photography... You'll find all kinds of profiles on Greet, to suit everyone's needs. Profiles on the app range from \"Foody\" profiles with 10,000 subscribers, to \"Lifestyle\" profiles with millions of followers.",
        },
        {
            question: "How many influencers will I receive per month?",
            answer:
                "Greet is still in Beta testing and appointments might not come as fast as you expect. That's why you will not pay anything until we can assure you to receive AT LEAST 10 influencers per month",
        },
        {
            question: "Do I have to justify rejections?",
            answer:
                "When you decide to reject a request from an influencer, you don't need to justify your refusal. Influencers are used to being turned down by establishments, so they don't get formal about it.",
        },
        {
            question: "What's in it for influencers?",
            answer:
                "The standard deal for influencers is as follows: make a minimum of 3 stories OR a reel, tagging the establishment's Instagram account.",
        },
    ],

    "How it works": [
        {
            question: "How do I validate or refuse a request?",
            answer:
                "You can validate or refuse a request directly from the Greet web application. In the \"Bookings\" category, you'll find your new reservation requests still pending, and you can accept them if the profile suits you, or refuse them if it doesn't.",
        },
        {
            question: "How can I be notified of requests?",
            answer:
                "Simply open the Greet web application and check the pending requests. To make sure you don't miss out on any requests, notifications are sent to you by e-mail and by SMS.",
        },
        {
            question: "How do I keep track of my bookings?",
            answer:
                "On Greet, accepted requests are listed in the \"Approved\" tab, sorted by date to help you keep track of your bookings.",
        },
        {
            question: "How do I change my password?",
            answer:
                "If you can't log in, you can try to change your password by clicking on \"Forgot password?\" when logging in to Greet. If you need or want to change your password, you can find the \"Change password\" tab in the \"Your Profile\" tab of the web application.",
        },
        {
            question: "Where can I see my analytics?",
            answer:
                "The Greet Team is currently working on a new Dashboard where you will be able to see your monthly analytics! For now, you can checkout the “Content” page in the Greet dashboard for per-content analytics.",
        },
        {
            question: "Who do I contact if I have a problem?",
            answer:
                "You can send us an e-mail to info@greet.club",
        },
    ]
};

export default function Faqs() {
    return (
        <div className="mx-auto max-w-4xl">

            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl uppercase font-logo">Frequently asked questions</h2>

            {Object.keys(faqs).map((faqsSection) => (
                <div key={faqsSection} className='mt-16'>
                    <p className='text-xl font-bold font-logo'>{faqsSection}</p>
                    <dl className="space-y-6 divide-y divide-gray-900/10">
                        {(faqs[faqsSection as FaqSection] || []).map((faq) => (
                            <Disclosure as="div" key={faq.question} className="pt-6">
                                {({ open }) => (
                                    <>
                                        <dt>
                                            <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                                                <span className="text-base font-semibold leading-7">{faq.question}</span>
                                                <span className="ml-6 flex h-7 items-center">
                                                    {open ? (
                                                        <MinusSmallIcon className="h-6 w-6" aria-hidden="true" />
                                                    ) : (
                                                        <PlusSmallIcon className="h-6 w-6" aria-hidden="true" />
                                                    )}
                                                </span>
                                            </Disclosure.Button>
                                        </dt>
                                        <Disclosure.Panel as="dd" className="mt-2 pr-12">
                                            <p className="text-base leading-8 text-gray-600">{faq.answer}</p>
                                        </Disclosure.Panel>
                                    </>
                                )}
                            </Disclosure>
                        ))}
                    </dl>
                </div>
            ))}
        </div>
    )
}
