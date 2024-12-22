import ContactUsForm from '@/app/_components/ContactUsForm';
import Footer from '@/app/_components/Footer';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline'

export default function Page() {


  return (
    <div className="relative isolate bg-white max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 px-6 pt-24 sm:pt-32 lg:px-8">

        <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Get in touch</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            We love hearing from you! Whether you have a question, a suggestion, or just want to say hello, we&apos;re here to help. Our team is dedicated to providing top-notch customer service and ensuring your experience with us is nothing short of excellent.
          </p>
          <dl className="mt-10 space-y-4 text-base leading-7 text-gray-600">
            <div className="flex gap-x-4">
              <dt className="flex-none">
                <span className="sr-only">Telephone</span>
                <PhoneIcon className="h-7 w-6 text-gray-400" aria-hidden="true" />
              </dt>
              <dd>
                <a className="hover:text-gray-900" href="tel:+1 (555) 234-5678">
                  +1 (424) 537-9215
                </a>
              </dd>
            </div>
            <div className="flex gap-x-4">
              <dt className="flex-none">
                <span className="sr-only">Email</span>
                <EnvelopeIcon className="h-7 w-6 text-gray-400" aria-hidden="true" />
              </dt>
              <dd>
                <a className="hover:text-gray-900" href="mailto:hello@example.com">
                  info@greet.club
                </a>
              </dd>
            </div>
          </dl>
        </div>
        <ContactUsForm />
      </div>
    </div>
  )
}
