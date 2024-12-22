import LandingNavbar from "../_components/LandingNavbar"

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <LandingNavbar />
            <div className='relative max-w-7xl mx-auto'>
                {children}
            </div>
        </>
    )
}