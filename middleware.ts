import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  async function middleware(req) {

    if (req.nextauth.token?.role?.slug === "admin"){
      return;
    }

    // Protect admin and business dashboard routes
    if (req.nextUrl.pathname === "/dashboard/profile") {
      if (
        req.nextauth.token?.role?.slug !== "admin" &&
        req.nextauth.token?.role?.slug !== "business-owner"
      )
        return new NextResponse("Unauthorized", { status: 400 });
    }
    // Protect admin dahshboard routes
    else if (
      req.nextUrl.pathname === "/dashboard/admin" ||
      req.nextUrl.pathname === "/dashboard/creators" ||
      req.nextUrl.pathname === "/dashboard/businesses" ||
      req.nextUrl.pathname === "/dashboard/upload-media"
    ) {
      if (req.nextauth.token?.role?.slug !== "admin")
        return new NextResponse("Unauthorized", { status: 400 });
    }
    // Protect business dashboard routes
    else if (
      req.nextUrl.pathname === "/dashboard" ||
      /^\/dashboard\/listing/.test(req.nextUrl.pathname) ||
      /^\/dashboard\/bookings/.test(req.nextUrl.pathname) ||
      req.nextUrl.pathname === "/dashboard/content"
    ) {
      if (req.nextauth.token?.role?.slug !== "business-owner")
        return new NextResponse("Unauthorized", { status: 400 });
    }
    // Protect creators routes
    else if (
      /^\/listing/.test(req.nextUrl.pathname) ||
      /^\/bookings/.test(req.nextUrl.pathname) ||
      req.nextUrl.pathname === "/profile"
    ) {
      if (req.nextauth.token?.role?.slug !== "creator")
        return new NextResponse("Unauthorized", { status: 400 });

      // If the user IS a creator, and it does not have an Instagram Account
      // We redirect to the verify instagram account page (if it exists)

      // THIS MUST BE AN API ROUTE. SERVER ACTION WON'T WORK IN THE MIDDLEWARE
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/verify-instagram`,
        {
          method: "POST",
          body: JSON.stringify({ userId: req.nextauth.token.id }),
        }
      );

      if (!res.ok) return new NextResponse("Unauthorized", { status: 400 });

      const data = await res.json();

      if (!data.isVerified) {
        return NextResponse.redirect(
          new URL(`/verify-instagram/${data.verification.token}`, req.url)
        );
      }
    }
  },
  {
    callbacks: {
      authorized: (params) => {
        let { token } = params;
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/listings/:path*",
    "/bookings/:path*",
    "/profile",
  ],
};
