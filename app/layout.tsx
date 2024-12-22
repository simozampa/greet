import Provider from '@/app/_components/Provider'
import '@/app/globals.css'
import '@/public/fonts/fonts.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'GREET | Local Influencer Marketing',
  description: 'Unlock the power of Influencer Marketing! Promote your Food business with local Influencers',
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "https://www.greet.club"),
  keywords: ["Influencer", "Marketing", "Food Business", "Creators", "Instagram"],
  openGraph: {
    title: 'GREET | Local Influencer Marketing',
    description: 'Unlock the power of Influencer Marketing! Promote your Food business with local Influencers',
    url: 'https://www.greet.club',
    siteName: 'Greet',
    images: [
      {
        url: 'https://www.greet.club/opengraph.png',
        width: 1000,
        height: 1000,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <Provider>
        <body suppressHydrationWarning={true} className={inter.className}>
          {children}
        </body>
      </Provider>
    </html>
  )
}
