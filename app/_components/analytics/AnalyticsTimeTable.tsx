import { Fragment } from "react";
import { AnalyticsEvent } from "@prisma/client";
import { getAnalyticsEventsTypeBadge } from "@/app/_utils/helpers";

export default async function AnalyticsTimeTable({ data }: { data: AnalyticsEvent[] }) {

    const groupedEvents: { [key: string]: AnalyticsEvent[] } = {};

    // Iterate through the events and group them by day
    data.forEach((event: AnalyticsEvent) => {
        const createdAt = event.createdAt.toISOString().split('T')[0]; // Extract the date part
        if (!groupedEvents[createdAt]) {
            groupedEvents[createdAt] = [];
        }
        groupedEvents[createdAt].push(event);
    });

    return (
        <>
            {data.length > 0 ? (
                <div className="overflow-hidden border-t border-gray-100">
                    <div>
                        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
                            <table className="w-full text-left">
                                <tbody>
                                    {Object.keys(groupedEvents).map((day) => (
                                        <Fragment key={day}>
                                            <tr className="text-sm leading-6 text-gray-900">
                                                <th scope="colgroup" colSpan={3} className="relative isolate py-2 font-semibold">
                                                    <time dateTime={day}>{day}</time>
                                                    <div className="absolute inset-y-0 right-full -z-10 w-screen border-b border-gray-200 bg-gray-50" />
                                                    <div className="absolute inset-y-0 left-0 -z-10 w-screen border-b border-gray-200 bg-gray-50" />
                                                </th>
                                            </tr>
                                            {groupedEvents[day].map((event) => (
                                                <tr key={event.id}>
                                                    <td className="relative py-5 pr-6">
                                                        <div className="flex gap-x-6">
                                                            <div className="flex items-center gap-x-3">
                                                                <div className="text-sm font-medium leading-6 text-gray-900">{event.eventName}</div>
                                                                {event.eventType &&
                                                                    <>
                                                                        {getAnalyticsEventsTypeBadge(event.eventType)}
                                                                    </>
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="absolute bottom-0 right-full h-px w-screen bg-gray-100" />
                                                        <div className="absolute bottom-0 left-0 h-px w-screen bg-gray-100" />
                                                    </td>
                                                    <td className="hidden py-5 pr-6 sm:table-cell">
                                                        {
                                                            event.data ? (
                                                                <>
                                                                    {Object.keys(JSON.parse(event.data as string)).map((val, index) => (
                                                                        <div key={index} className="text-sm leading-6 text-gray-900 flex items-center">
                                                                            <svg viewBox="0 0 2 2" className="inline h-1 w-1 fill-current mr-2" aria-hidden="true">
                                                                                <circle cx={1} cy={1} r={1} />
                                                                            </svg>
                                                                            <span><span className="font-medium">{val}:</span> {JSON.parse(event.data as string)[val]}</span>
                                                                        </div>
                                                                    ))}

                                                                </>
                                                            ) : (
                                                                <div className="text-sm leading-6 text-gray-500">No data.</div>
                                                            )
                                                        }
                                                    </td>
                                                    <td className="py-5 text-right">
                                                        <div className="flex justify-end">
                                                            <time dateTime={event.createdAt.toLocaleString()}>
                                                                {new Date(event.createdAt).toLocaleString()}
                                                            </time>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-full flex items-center justify-center text-gray-500 my-4">
                    No data.
                </div>
            )}
        </>
    )
}