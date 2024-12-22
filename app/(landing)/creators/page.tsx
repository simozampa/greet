import Link from "next/link";
import PrimaryButton from "@/app/_components/PrimaryButton";
import { getServerSession } from "next-auth";
import { loginRedirect } from "@/app/_utils/helpers"
import { authOptions } from "@/app/_utils/auth";
import Newsletter from "@/app/_components/Newsletter";
import Image from "next/image";
import Footer from "@/app/_components/Footer";
import Carousel from "@/app/_components/Carousel";


import anticaCantina1 from '@/public/landing/antica-cantina-1.webp'
import anticaCantina2 from '@/public/landing/antica-cantina-2.webp'
import nusantara1 from '@/public/landing/nusantara-1.webp'
import nusantara2 from '@/public/landing/nusantara-2.webp'
import ohlala1 from '@/public/landing/ohlala-1.webp'
import ohlala2 from '@/public/landing/ohlala-2.webp'
import creatorHero from '@/public/landing/creator-hero.webp'

export default async function Page() {

    const session = await getServerSession(authOptions);

    // Redirect user if already logged in
    loginRedirect(session);

    return (
        <>
            <div className="px-6 lg:px-8 pt-16 sm:py-16 lg:py-32 relative">

                {/* Background Top */}
                <div
                    className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                    aria-hidden="true"
                >
                    <div
                        className="hidden lg:flex relative right-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-creator-500 to-creator-500 opacity-30 sm:-right-[calc(50%)] sm:w-[72.1875rem]"
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                    />
                </div>

                {/* Hero Content */}
                <div className="lg:max-w-4xl mx-auto">
                    <div className='text-center first-letter:py-4'>
                        <h1 className='text-2xl sm:text-4xl font-logo font-semibold text-gray-900 uppercase'>Experience, Create, and Inspire in Los Angeles!</h1>
                        <p className="mt-4 text-gray-700">
                            Greet automates deals with local food places, so you can unleash your talent and create exceptional content.
                        </p>
                        <div className='flex items-center justify-center space-x-4 pt-4'>
                            <Link href="/register/creators"><PrimaryButton className="bg-creator-500 hover:bg-creator-400 px-10 py-3">Get Started</PrimaryButton></Link>
                        </div>
                    </div>
                </div>
            </div>


            {/* Cards */}
            <div className="mt-16 lg:mt-0 px-4 lg:px-0 relative lg:max-w-7xl mx-auto">

                <ul role="list" className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                    {/* Card 1 */}
                    <li className="col-span-1 flex flex-col">
                        <div className="relative rounded-xl overflow-hidden shadow-md">
                            <Carousel loop>
                                <div className="relative h-48 flex-[0_0_100%]">
                                    <Image
                                        src={anticaCantina1}
                                        alt="A plate of Pasta with Ragu from L'Antica Cantina Italian restaurant"
                                        className="w-full h-full object-center object-cover"
                                    />
                                </div>
                                <div className="relative h-48 flex-[0_0_100%]">
                                    <Image
                                        src={anticaCantina2}
                                        alt="A Bruschetta from L'Antica Cantina Italian restaurant"
                                        className="w-full h-full object-center object-cover"
                                    />
                                </div>
                            </Carousel>
                            <div className="text-start px-6 py-4 cursor-pointer">
                                <span className="font-semibold text-gray-900">L&#39;antica Cantina</span>
                                <span className="ml-2 pl-2 text-gray-500 border-l border-gray-200 text-sm">
                                    Italian
                                </span>
                                <span className='ml-2 mt-1 inline-flex flex-shrink-0 items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ring-green-600/20 bg-green-50 text-green-700'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3 h-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                    Applied
                                </span>
                                <p className="mt-1 text-gray-700 font-medium text-sm text-start">
                                    Dinner for 2 - appetizers, main, and dessert
                                </p>
                                <p className="mt-1 text-gray-500 text-sm text-start">
                                    Los Angeles
                                </p>
                            </div>
                        </div>
                    </li>

                    {/* Card 2 */}
                    <li className="col-span-1 flex flex-col">
                        <div className="relative rounded-xl overflow-hidden shadow-md">
                            <Carousel loop>
                                <div className="relative h-48 flex-[0_0_100%]">
                                    <Image
                                        src={nusantara1}
                                        alt="Plate with fish and veggies from the Nusantara Indonesian Restaurant"
                                        className="w-full h-full object-center object-cover"
                                    />
                                </div>
                                <div className="relative h-48 flex-[0_0_100%]">
                                    <Image
                                        src={nusantara2}
                                        alt="Plate with Nasi Goreng from the Nusantara Indonesian Restaurant"
                                        className="w-full h-full object-center object-cover"
                                    />
                                </div>
                            </Carousel>
                            <div className="text-start px-6 py-4 cursor-pointer">
                                <span className="font-semibold text-gray-900">Nusantara</span>
                                <span className="ml-2 pl-2 text-gray-500 border-l border-gray-200 text-sm">
                                    Indonesian
                                </span>
                                <p className="mt-1 text-gray-700 font-medium text-sm text-start">
                                    Try our famous Nasi Goreng!
                                </p>
                                <p className="mt-1 text-gray-500 text-sm text-start">
                                    Los Angeles
                                </p>
                            </div>
                        </div>
                    </li>

                    {/* Card 3 */}
                    <li className="col-span-1 flex flex-col">
                        <div className="relative rounded-xl overflow-hidden shadow-md">
                            <Carousel loop>
                                <div className="relative h-48 flex-[0_0_100%]">
                                    <Image
                                        src={ohlala1}
                                        alt="A plate of bread and Croissant from Oh La La French Bakery"
                                        className="w-full h-full object-center object-cover"
                                    />
                                </div>
                                <div className="relative h-48 flex-[0_0_100%]">
                                    <Image
                                        src={ohlala2}
                                        alt="A salty Croissant from Oh La La French Bakery"
                                        className="w-full h-full object-center object-cover"
                                    />
                                </div>
                            </Carousel>
                            <div className="text-start px-6 py-4 cursor-pointer">
                                <span className="font-semibold text-gray-900">OH LA LA</span>
                                <span className="ml-2 pl-2 text-gray-500 border-l border-gray-200 text-sm">
                                    French
                                </span>
                                <span className='ml-2 mt-1 inline-flex flex-shrink-0 items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ring-green-600/20 bg-green-50 text-green-700'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3 h-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                    Applied
                                </span>
                                <p className="mt-1 text-gray-700 font-medium text-sm text-start">
                                    Enjoy our selection of assorted pastries
                                </p>
                                <p className="mt-1 text-gray-500 text-sm text-start">
                                    Los Angeles
                                </p>
                            </div>
                        </div>
                    </li>

                </ul>

                <div className="lg:w-2/3 mx-auto lg:mt-32">
                    <Image
                        src={creatorHero}
                        alt="App screenshot of a business listing on Greet by Oh La La Bakary"
                        className="hidden sm:block w-full h-full"
                    />
                </div>

            </div>

            <div className="py-12 lg:py-24">
                <Newsletter userType="creator" color="creator" />
            </div>

            <Footer />
        </>
    )
}


