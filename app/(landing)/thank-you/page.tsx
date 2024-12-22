import Link from 'next/link'
import PrimaryButton from '@/app/_components/PrimaryButton'

export default function Page() {
    return (
        <div className='relative min-h-screen w-full py-12'>

            <div className='my-16 py-16 lg:py-32 px-8 lg:px-16'>
                {/* Title and Description */}
                <div className='text-center first-letter:py-4 max-w-md mx-auto'>
                    <h1 className='text-5xl font-semibold text-gray-900'>Thank you!</h1>
                    <p className='text-xl text-gray-700 mt-4'>You will hear back from us shortly, check your emails.</p>
                </div>
                {/* Sing in and Sign up Buttons */}
                <div className='flex items-center justify-center space-x-4 pt-8'>
                    <Link href="/"><PrimaryButton className='px-8 lg:px-14 py-4'>Back Home</PrimaryButton></Link>
                </div>
            </div>
        </div>
    )
}