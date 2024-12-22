
'use client';

import { format, addMinutes, setHours, isBefore, setMinutes, parse } from 'date-fns';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Availability, DayData, DaySlug } from '../_utils';
import { daysData } from '../_utils/constants';
import { cn } from '../_utils/helpers';
import { useMountEffect } from '../_utils/useMountEffect';


interface ScheduleSelectorProps {
    defaultValues: Availability | undefined;
    onChange: (data: Availability) => void;
}

export default function ScheduleSelector({ defaultValues, onChange }: ScheduleSelectorProps) {

    const [selectedSlots, setSelectedSlots] = useState<Availability>(
        defaultValues ? defaultValues : {
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: []
        }
    );

    const [timeSlots, setTimeSlots] = useState<string[]>([]);


    const getTimeSlots = () => {
        const startTime = setHours(setMinutes(new Date(), 0), 8); // Set the start time to 7 AM
        const endTime = setHours(setMinutes(new Date(), 0), 23); // Set the end time to 12 AM (midnight)

        const slots = [];
        let currentTime = startTime;

        while (isBefore(currentTime, endTime)) {
            const slot = format(currentTime, 'h a');
            slots.push(slot);

            currentTime = addMinutes(currentTime, 60);
        }

        setTimeSlots(slots);
    };

    // Define a custom sorting function
    function compareTime(a: string, b: string) {
        const timeA = new Date("1970-01-01 " + a);
        const timeB = new Date("1970-01-01 " + b);
        return Number(timeA) - Number(timeB);
    }

    const handleSlotClick = (daySlug: DaySlug, time: string) => {

        let hoursForDay = selectedSlots[daySlug]
        if (hoursForDay.includes(time)) {
            hoursForDay = hoursForDay.filter((s: string) => s !== time)
        } else {
            hoursForDay = [...hoursForDay, time];
        }

        setSelectedSlots((prevState: Availability) => ({
            ...prevState,
            [daySlug]: hoursForDay.sort(compareTime)
        }));
    };

    const addTime = (timeString: string, minutesToAdd: number) => {
        const parsedTime = parse(timeString, 'h a', new Date());
        const newTime = addMinutes(parsedTime, minutesToAdd);
        const formattedTime = format(newTime, 'h:mm a');
        return formattedTime;
    };

    const formattedTime = (timeString: string) => {
        const parsedTime = parse(timeString, 'h a', new Date());
        const formattedTime = format(parsedTime, 'h:mm a');
        return formattedTime;
    }

    useMountEffect(() => getTimeSlots())

    useEffect(() => {
        onChange(selectedSlots);
    }, [selectedSlots])


    return (
        <div className="flex flex-col max-w-full">

            <div className="isolate flex flex-auto flex-col overflow-hidden">
                <div className="relative flex max-w-full flex-none flex-col sm:max-w-none md:max-w-full ">

                    <div className="grid flex-auto grid-cols-1 grid-rows-1 sticky">

                        {/* Header */}
                        <div
                            className="col-span-full flex"
                        >
                            {/* Dummy space div */}
                            <div className="w-12" />

                            <div className="w-full grid grid-cols-7 gap-x-1">
                                <div className="col-span-7 border-b border-gray-200">

                                    {/* Mobile days */}
                                    <div className="grid grid-cols-7 text-sm leading-6 text-gray-500 sm:hidden">
                                        {daysData.map((day: DayData) => (
                                            <div key={day.slug} className="flex flex-col items-center pb-3 pt-2">
                                                {day.shortName}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Desktop days */}
                                    <div className="hidden grid-cols-7 text-sm leading-6 text-gray-500 sm:grid">
                                        {daysData.map((day: DayData) => (
                                            <div key={day.slug} className="flex items-center justify-center py-3">
                                                {day.mediumName}
                                            </div>

                                        ))}
                                    </div>

                                </div>
                            </div>



                            {/* sticky top-0 z-30 flex-none bg-white shadow ring-1 ring-black ring-opacity-5 sm:pr-8 */}


                        </div>

                        {/* Row (time) */}
                        {timeSlots.map((time: string) => (

                            <div key={time} className='col-span-full flex mt-2 gap-x-1'>

                                {/* Column for specific time */}
                                <div className="w-12 z-20 pr-2 text-right text-xs leading-5 text-gray-400 whitespace-nowrap -mt-1">
                                    {time}
                                </div>
                                <div className="w-full grid grid-cols-7 gap-x-1">

                                    {/* Setup the hour slot for every day of the week. */}
                                    {daysData.map((day: DayData) => (
                                        <div key={day.slug} className="space-y-1">
                                            <div
                                                onClick={() => handleSlotClick(day.slug, formattedTime(time))}
                                                className={cn("cursor-pointer p-2 rounded-sm sm:rounded-md", selectedSlots[day.slug].includes(formattedTime(time)) ? 'bg-business-500 hover:bg-business-400' : 'bg-gray-100 hover:bg-gray-200')}
                                            >
                                            </div>
                                            <div
                                                onClick={() => handleSlotClick(day.slug, addTime(time, 30))}
                                                className={cn("cursor-pointer p-2 rounded-sm sm:rounded-md", selectedSlots[day.slug].includes(addTime(time, 30)) ? 'bg-business-500 hover:bg-business-400' : 'bg-gray-100 hover:bg-gray-200')}
                                            >
                                            </div>
                                        </div>
                                    ))}
                                </div>



                            </div>
                        ))}

                    </div>

                </div>
            </div>
        </div>
    )
}