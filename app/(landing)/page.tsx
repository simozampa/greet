import Link from "next/link";
import PrimaryButton from "../_components/PrimaryButton";
import { getServerSession } from "next-auth";
import { authOptions } from "../_utils/auth";
import { redirect } from "next/navigation";
import Newsletter from "../_components/Newsletter";
import Footer from "../_components/Footer";
import { PlayIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

import phoneImage from '@/public/landing/phone.webp'
import avaProfilePicture from '@/public/landing/ava-thompson.webp'
import ethanProfilePicture from '@/public/landing/ethan-wilson.webp'
import isabellaProfilePicture from '@/public/landing/isabella-martinez.webp'

import createYouOfferPicture from '@/public/landing/create-your-offer.webp'
import scheduleVisitsPicture from '@/public/landing/schedule-visits.webp'
import shineOnSocialMediaPicture from '@/public/landing/shine-on-social-media.webp'
import Faqs from "../_components/Faqs";


export default async function Page() {

  const session = await getServerSession(authOptions);
  const role = session?.user?.role?.slug;

  if (role === 'admin') {
    redirect('/dashboard/admin');
  }
  else if (role === 'business-owner') {
    redirect('/dashboard');
  }
  else if (role === 'creator') {
    redirect('/listings')
  }

  return (
    <>
      <div className="px-6 lg:px-8 py-16 lg:py-32 relative">

        {/* Background Top */}
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="hidden sm:block left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[0deg] bg-gradient-to-tr from-business-500 to-business-500 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          ></div>
        </div>

        {/* Hero Content */}
        <div className="lg:max-w-4xl mx-auto bg-transparent">
          <div className='text-center first-letter:py-4'>
            <h1 className='text-2xl sm:text-4xl font-logo font-semibold text-gray-900 uppercase'>PROMOTE YOUR FOOD BUSINESS WITH LOCAL INFLUENCERS</h1>
            <p className="mt-4 text-gray-700">
              Tap into local Instagram talent for increased foot traffic, sales, and repeat visits.
            </p>
            <div className='flex items-center justify-center space-x-4 pt-4'>
              <Link href="/register/businesses"><PrimaryButton className="bg-business-500 hover:bg-business-400 px-10 py-3">Get Started</PrimaryButton></Link>
            </div>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="px-6 lg:px-0 relative lg:max-w-4xl mx-auto">

        {/* Card 1 */}
        <div className="relative w-full md:flex md:justify-end">
          <div className="md:w-1/2 rounded-lg bg-white shadow-md ring-1 ring-gray-200 p-4 md:mr-16">
            <div className="flex w-full items-start justify-between">
              <div className="flex items-start space-x-2">
                <div className="relative h-12 w-12 flex-shrink-0 rounded-full bg-gray-300 overflow-hidden">
                  <Image
                    src={avaProfilePicture}
                    alt="Ava Thompson Profile picutre in business Booking"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Ava Thompson</p>
                  <p className="text-gray-500 text-sm font-medium">@ava.adventures</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-end">
                <span className={`inline-flex flex-shrink-0 items-center rounded-md px-2 py-0.5 text-sm font-medium ring-1 ring-inset bg-green-50 ring-green-600/20 text-green-700`}>
                  Approved
                </span>
                <p className="mt-1 text-xs text-gray-500 w-full text-right">Today at 9:00 AM</p>
              </div>
            </div>


            <div className="mt-6 flex items-center justify-between space-x-4">
              <div>
                <p className="font-semibold text-sm text-gray-900">198.2k</p>
                <p className="text-sm text-gray-500">Followers</p>
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900">555.5k</p>
                <p className="text-sm text-gray-500">Reach</p>
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900">762k</p>
                <p className="text-sm text-gray-500">Engagement</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="relative w-full mt-2 md:-mt-16">
          <div className="md:w-1/2 rounded-lg bg-white shadow-md ring-1 ring-gray-200 p-4 md:ml-16">
            <div className="flex w-full items-start justify-between">
              <div className="flex items-start space-x-2">
                <div className="relative h-12 w-12 flex-shrink-0 rounded-full bg-gray-300 overflow-hidden">
                  <Image
                    src={ethanProfilePicture}
                    alt="Ethan Wilson Profile picutre in business Booking"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Ethan Wilson</p>
                  <p className="text-gray-500 text-sm font-medium">@wilsonwanderer</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-end">
                <span className={`inline-flex flex-shrink-0 items-center rounded-md px-2 py-0.5 text-sm font-medium ring-1 ring-inset bg-yellow-50 ring-yellow-600/20 text-yellow-700`}>
                  Pending
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between space-x-4">
              <div>
                <p className="font-semibold text-sm text-gray-900">180.1k</p>
                <p className="text-sm text-gray-500">Followers</p>
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900">643.2k</p>
                <p className="text-sm text-gray-500">Reach</p>
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900">762.7k</p>
                <p className="text-sm text-gray-500">Engagement</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="relative w-full md:flex md:justify-end mt-2 md:-mt-16">
          <div className="md:w-1/2 rounded-lg bg-white shadow-md ring-1 ring-gray-200 p-4 md:mr-52">
            <div className="flex w-full items-start justify-between">
              <div className="flex items-start space-x-2">
                <div className="relative h-12 w-12 flex-shrink-0 rounded-full bg-gray-300 overflow-hidden">
                  <Image
                    src={isabellaProfilePicture}
                    alt="Isabella Martinez Profile picutre in business Booking"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Isabella Martinez</p>
                  <p className="text-gray-500 text-sm font-medium">@izzy.eats</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-end">
                <span className={`inline-flex flex-shrink-0 items-center rounded-md px-2 py-0.5 text-sm font-medium ring-1 ring-inset bg-green-50 ring-green-600/20 text-green-700`}>
                  Approved
                </span>
                <p className="mt-1 text-xs text-gray-500 w-full text-right">Today at 7:00 PM</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between space-x-4">
              <div>
                <p className="font-semibold text-sm text-gray-900">82.4k</p>
                <p className="text-sm text-gray-500">Followers</p>
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900">113.2k</p>
                <p className="text-sm text-gray-500">Reach</p>
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-900">245.2k</p>
                <p className="text-sm text-gray-500">Engagement</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 overflow-hidden bg-white py-24 sm:py-32">

        {/* User generated content */}
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:max-w-4xl lg:grid-cols-3 items-center">
          <div className="lg:col-span-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl uppercase font-logo">Why user-generated content?</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Authentic and Engaging.<br />
              Real people instead of ad platforms.<br />
              10x better results than traditional marketing.
            </p>
          </div>

          <div className="relative flex justify-center lg:justify-end">

            <a href="https://www.instagram.com/p/CvN-kaOA64p/" className="relative">
              <Image
                src={phoneImage}
                alt="Instagram post created by Influencer for OH LA LA Bakery via Greet App."
                className="cursor-pointer"
              />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <PlayIcon className="h-10 w-10 text-white hover:text-gray-400 opacity-50 cursor-pointer" />
              </div>
            </a>
          </div>
        </div>


        {/* Steps */}
        <div className="mt-32 sm:mt-56 space-y-24 lg:space-y-48">

          {/* Step 1: Create your offer */}
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 items-center">
            <div className="flex flex-wrap lg:flex-nowrap items-start">
              <div className="text-center lg:text-right w-full">
                <div className="lg:mr-4">
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl uppercase font-logo">Create your offer</h2>
                  <p className="mt-6 text-lg leading-8 text-gray-600">
                    Describe your business or promotion and publish it on Greet.
                  </p>
                </div>

              </div>
              <div className="w-full flex justify-center order-first mb-4 lg:mb-0 lg:order-last lg:w-auto">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white font-logo">
                  1
                </div>
              </div>

            </div>
            <div className="flex items-start justify-center lg:order-first">
              <Image
                src={createYouOfferPicture}
                alt="Business offer of a OH LA LA Bakery on Greet."
                className="w-full h-auto"
              />
            </div>
          </div>


          {/* Step 2: Schedule Visits */}
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 items-center">
            <div className="flex flex-wrap lg:flex-nowrap items-start">
              <div className="w-full flex justify-center mb-4 lg:mb-0 lg:w-auto">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white font-logo">
                  2
                </div>
              </div>
              <div className="text-center lg:text-left w-full">
                <div className="lg:ml-4">
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl uppercase font-logo">Schedule visits</h2>
                  <p className="mt-6 text-lg leading-8 text-gray-600">
                    Influencers book directly through our app. Approve those you&#39;d like to work with, and we&#39;ll send a calendar invite to everyone with all the details.
                  </p>
                </div>

              </div>
            </div>
            <div className="flex items-start justify-center">
              <div className="relative w-full h-auto">
                <Image
                  src={scheduleVisitsPicture}
                  alt="User Interface showing a scheduled visit with the influencer Ethan Wilson."
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Shine on social media */}
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 items-center">
            <div className="flex flex-wrap lg:flex-nowrap items-start">
              <div className="text-center lg:text-right w-full">
                <div className="lg:mr-4">
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl uppercase font-logo">Shine on social media</h2>
                  <p className="mt-6 text-lg leading-8 text-gray-600">
                    Welcome influencers, and track your results on a single dashboard.
                  </p>
                </div>

              </div>
              <div className="w-full flex justify-center order-first mb-4 lg:mb-0 lg:order-last lg:w-auto">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white font-logo">
                  3
                </div>
              </div>
            </div>
            <div className="flex items-start justify-center lg:order-first">
              <Image
                src={shineOnSocialMediaPicture}
                alt="User Interface showing the report of the Influencer Ethan Wilson visiting a food bakery through Greet."
                className="w-full h-auto"
              />
            </div>
          </div>

        </div>

      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 lg:py-24">
        <Faqs />
      </div>

      <div className="py-12 lg:py-24">
        <Newsletter userType="business-owner" color="business" />
      </div>
      <Footer />
    </>
  )
}
