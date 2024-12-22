import { db } from "@/app/_utils/db";
import { ContactRequest, NewsletterSubscriber } from "@prisma/client";

async function getContactRequests() {

    const contactRequests: ContactRequest[] = await db.contactRequest.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    })

    return contactRequests;
};

async function getNewsletterSubcribers() {

    const newsletterSubscribers: NewsletterSubscriber[] = await db.newsletterSubscriber.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    })

    return newsletterSubscribers;
};

// To force the page to opt out of full page cache https://nextjs.org/docs/app/building-your-application/caching#opting-out-2
export const dynamic = 'force-dynamic'

export default async function Page() {

    const contacts = await getContactRequests();
    const newsletterSubcribers = await getNewsletterSubcribers();

    return (
        <>
            <div>

                {/* Title and Add User Button */}
                <div className="sm:flex sm:items-start mb-4 md:mb-8">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold leading-6 text-gray-900">Contacts</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Contacts received from the &quot;Contact Us&quot; page.
                        </p>
                    </div>
                </div>

                <div className="mt-6">
                    {contacts && contacts.length > 0 ?
                        <div className="w-full">
                            <div className="mt-8 flow-root">
                                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                        <table className="min-w-full divide-y divide-gray-300">
                                            <thead>
                                                <tr>
                                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                                        Email
                                                    </th>
                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                        Name
                                                    </th>
                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                        Phone
                                                    </th>
                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                        Message
                                                    </th>
                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                        Date
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {contacts.map((contact) => (
                                                    <tr key={contact.id}>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                                            {contact.email}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {contact.firstName + ' ' + contact.lastName}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {contact.phoneNumber}
                                                        </td>
                                                        <td className="px-3 py-4 text-sm text-gray-500">
                                                            {contact.message}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {new Date(contact.createdAt).toLocaleDateString('en-US', { month: "2-digit", day: "2-digit", year: "numeric" })}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="flex items-center justify-center py-10 text-gray-600">
                            No data.
                        </div>
                    }
                </div>
            </div>

            <hr className="my-20 border border-gray-200" />

            <div>

                {/* Title and Add User Button */}
                <div className="sm:flex sm:items-start mb-4 md:mb-8">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold leading-6 text-gray-900">Newsletter Subscribers</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            People subscribed to our newsletter.
                        </p>
                    </div>
                </div>

                <div className="mt-6">
                    {newsletterSubcribers && newsletterSubcribers.length > 0 ?
                        <div className="w-full">
                            <div className="mt-8 flow-root">
                                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                        <table className="min-w-full divide-y divide-gray-300">
                                            <thead>
                                                <tr>
                                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                                        Email
                                                    </th>
                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                        User Type
                                                    </th>
                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                        Date
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {newsletterSubcribers.map((subscriber) => (
                                                    <tr key={subscriber.id}>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                                            {subscriber.email}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {subscriber.userType}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {new Date(subscriber.createdAt).toLocaleDateString('en-US', { month: "2-digit", day: "2-digit", year: "numeric" })}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="flex items-center justify-center py-10 text-gray-600">
                            No data.
                        </div>
                    }
                </div>
            </div>
        </>

    )
}