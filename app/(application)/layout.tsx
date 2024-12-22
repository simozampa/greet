import ApplicationNavbar from '@/app/_components/ApplicationNavbar'

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <ApplicationNavbar />
            <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
                {children}
            </div>
        </>
    )
}
