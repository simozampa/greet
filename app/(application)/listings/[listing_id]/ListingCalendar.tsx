'use client'

import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import PrimaryButton from '../../../_components/PrimaryButton'
import { Availability, DateAndTimeSlots, DaySlug } from '../../../_utils'
import { cn } from '../../../_utils/helpers'
import { useRouter } from 'next/navigation'
import LoadingIcon from '@/app/_components/LoadingIcon'

interface ListingCalendarProps {
    creatorId: string
    businessId: string
    listingId: string
    availability: Availability
}

const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' } as Intl.DateTimeFormatOptions;
const monthOptions = { month: 'long' } as Intl.DateTimeFormatOptions;
const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export default function ListingCalendar({ creatorId, businessId, listingId, availability }: ListingCalendarProps) {

    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);
    const [selectedSlots, setSelectedSlots] = useState<DateAndTimeSlots>({});
    const [displayError, setDisplayError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    const today = new Date();
    const displayHours = selectedDay && selectedDay.getDay() !== null ? availability[weekdays[selectedDay.getDay()] as DaySlug] : null;
    const days = getDaysArray() as Date[];

    function goToNextMonth() {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + 1);
        if (newDate.getMonth() === 0) {
            newDate.setFullYear(newDate.getFullYear());
        }
        setCurrentDate(newDate);
    }

    function goToPreviousMonth() {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() - 1);
        if (newDate.getMonth() === 11) {
            newDate.setFullYear(newDate.getFullYear());
        }
        setCurrentDate(newDate);
    }

    function toggleTimeSlot(day: Date, time: string) {
        const date = getStringDate(day);

        // Count how many slots were already selected
        let counter = 0;
        for (const slot in selectedSlots) {
            counter += selectedSlots[slot].length;
        }

        // Limimt max number of selected slots to 5
        if (counter >= 5) {
            // If trying to add a slot, display error and return
            if (!selectedSlots[date] || (selectedSlots[date] && selectedSlots[date].indexOf(time) === -1)) {
                setDisplayError(true);
                return;
            }
            // If trying to remove a slot, remove error
            setDisplayError(false);
        }

        setSelectedSlots((prevSlots: DateAndTimeSlots) => {
            const updatedSlots = { ...prevSlots };

            // Check if the date already exists in state
            if (updatedSlots[date]) {


                const timeIndex = updatedSlots[date].indexOf(time);
                // If the time already exists for the date, remove it
                if (timeIndex !== -1) {

                    const times = [...updatedSlots[date]]
                    times.splice(timeIndex, 1);

                    // If there are no times left for the date, remove the date from state
                    if (times.length === 0) {
                        delete updatedSlots[date];
                    } else {
                        updatedSlots[date] = times;
                    }
                }
                // Add the time to the existing date
                else {
                    updatedSlots[date] = [...updatedSlots[date], time];
                }
            }
            // Add a new date and time to state
            else {
                updatedSlots[date] = [time];
            }
            return { ...updatedSlots };
        });
    }

    function getDaysArray() {
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // Get the first day of the current month
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // Get the last day of the current month
        const firstDayOfWeek = firstDay.getDay() !== 0 ? firstDay.getDay() : 7; // Get the day of the week for the first day of the month (0 for Sunday, 1 for Monday, etc.)
        const days = [];

        // Add days from the previous month
        for (let i = 1; i < firstDayOfWeek; i++) {
            days.push(null);
        }
        // Add days from the current month
        let currentDateObj = new Date(firstDay);
        while (currentDateObj <= lastDay) {
            days.push(new Date(currentDateObj));
            currentDateObj.setDate(currentDateObj.getDate() + 1);
        }
        // Add days from the next month
        days.push(null);
        while (currentDateObj.getDay() > 0) {
            days.push(null);
            currentDateObj.setDate(currentDateObj.getDate() + 1);
        }

        return days;
    }

    function getStringDate(date: Date) {
        const formattedDate = date.toLocaleDateString('en-US', options);
        const [weekday, month, day, year] = formattedDate.split(/, |\s/);
        return weekday + " " + month + " " + day + ", " + year;
    }

    function isToday(date: Date) {
        return (date.getFullYear() === today.getFullYear()) && (date.getMonth() === today.getMonth()) && (date.getDate() === today.getDate());
    }

    function areDatesEqual(date1: Date, date2: Date) {
        return (date1.getFullYear() === date2.getFullYear()) && (date1.getMonth() === date2.getMonth()) && (date1.getDate() === date2.getDate());
    }

    function isDateAvailable(date: Date) {
        return availability[weekdays[date.getDay()] as DaySlug].length > 0;
    }

    async function submitApplication() {
        if (loading) return;
        setLoading(true);

        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/users/creators/${creatorId}/bookings`, {
            method: 'POST',
            body: JSON.stringify({
                timeSlots: selectedSlots,
                listingId: listingId,
                businessId: businessId,
            })
        });

        if (!response.ok) throw new Error('could not submit')

        const booking = await response.json();

        router.push('/bookings');
        router.refresh();
    }

    return (
        <>
            <div className='grid grid-cols-1 sm:grid-cols-2'>
                <div>
                    <div className="flex items-center">
                        <h2 className="flex-auto font-semibold text-gray-900">{currentDate.toLocaleDateString('en-US', monthOptions) + " " + currentDate.getFullYear()}</h2>
                        <button
                            onClick={goToPreviousMonth}
                            type="button"
                            className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                        >
                            <span className="sr-only">Previous month</span>
                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <button
                            onClick={goToNextMonth}
                            type="button"
                            className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                        >
                            <span className="sr-only">Next month</span>
                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="mt-10 grid grid-cols-7 text-center text-xs leading-6 text-gray-500">
                        <div>M</div>
                        <div>T</div>
                        <div>W</div>
                        <div>T</div>
                        <div>F</div>
                        <div>S</div>
                        <div>S</div>
                    </div>
                    <div className="mt-2 grid grid-cols-7 text-sm">
                        {days.map((day: Date, dayIdx: number) => (
                            <div key={dayIdx} className='py-2'>
                                {day !== null ?
                                    <>
                                        <button
                                            onClick={() => setSelectedDay(day)}
                                            type="button"
                                            className={cn(
                                                day !== selectedDay && (!isDateAvailable(day) || today > day) && 'text-gray-500',
                                                day !== selectedDay && (isDateAvailable(day) && today < day) && 'bg-creator-50 ring-1 ring-creator-600/20 text-creator-700 font-semibold',
                                                selectedDay && areDatesEqual(day, selectedDay) && 'text-white bg-creator-500 font-semibold',
                                                selectedDay && !areDatesEqual(day, selectedDay) && day !== selectedDay && 'hover:bg-creator-50',
                                                'relative mx-auto flex h-8 w-8 items-center justify-center rounded-full'
                                            )}
                                        >
                                            <time dateTime={day.toLocaleDateString('en-US', options)}>{day.getDate()}</time>
                                            {isToday(day) ?
                                                <div className='absolute text-4xl -bottom-0-1 text-gray-500'>.</div>
                                                :
                                                <div ></div>
                                            }
                                        </button>
                                    </>
                                    :
                                    <></>
                                }
                            </div>
                        ))}
                    </div>
                </div>
                <div className='mt-10 lg:mt-0 lg:ml-16'>
                    {selectedDay &&
                        <h2 className="text-base font-semibold leading-6 text-gray-900">
                            Schedule for {getStringDate(selectedDay)}
                        </h2>
                    }

                    <div className="grid grid-cols-2 mt-4 mb-2 gap-x-2">
                        {displayHours && displayHours.length > 0 && selectedDay && selectedDay > today ?
                            displayHours.map((hour) => (
                                <PrimaryButton
                                    key={hour}
                                    onClick={() => toggleTimeSlot(selectedDay, hour)}
                                    className={
                                        cn('mt-2 w-full py-2 bg-white ring-1 ring-creator-600/20 text-creator-700 hover:bg-creator-50/50',
                                            selectedSlots[getStringDate(selectedDay)] && selectedSlots[getStringDate(selectedDay)].some((x: string) => x === hour) && 'bg-creator-50')}
                                >
                                    {hour}
                                </PrimaryButton>)
                            )
                            : selectedDay && ((!displayHours || displayHours.length === 0) || selectedDay <= today) &&
                            <span className='text-sm'>
                                No available time slots for this date.
                            </span>
                        }

                    </div>
                    {displayError &&
                        <span className='text-center rounded-md py-1 px-2 ring-1 ring-red-600/20 text-xs text-red-700 bg-red-50'>
                            You can only select up to 5 time slots
                        </span>
                    }
                </div>

            </div >
            {selectedSlots && Object.keys(selectedSlots).length > 0 &&
                <div className="mt-8">
                    <span className='font-semibold text-gray-900'>Selected time slots:</span>
                    <div className="mt-2" >
                        {Object.entries(selectedSlots).map(([date, timeSlots]) => (
                            <div key={date}>
                                <span className="text-sm font-medium">{date} - </span>
                                {timeSlots.map((time: string, index: number) => (
                                    <span key={index}>
                                        <span className="text-sm font-medium">
                                            {time}
                                        </span>
                                        {index < timeSlots.length - 1 && <span>{", "}</span>}
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                    <PrimaryButton
                        onClick={submitApplication}
                        className='w-full sm:w-min mt-4 bg-creator-500 hover:bg-creator-400' >
                        Submit
                        {loading && <LoadingIcon iconSize="h-4 w-4" textColor="text-white" />}
                    </PrimaryButton>
                </div >
            }

        </>

    )
}
