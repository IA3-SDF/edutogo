import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect Admin route
  if (pathname.startsWith("/admin")) {
    const roleCookie = request.cookies.get("edutogo-role")?.value;
    const isLoggedInCookie = request.cookies.get("edutogo-logged-in")?.value;

    // Check if user is logged in and is admin
    if (
      !isLoggedInCookie ||
      isLoggedInCookie !== "true" ||
      roleCookie !== "admin"
    ) {
      // Redirect unauthorized user to home or student panel
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/";
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Protect Student route
  if (pathname.startsWith("/student") || pathname.startsWith("/settings")) {
    const isLoggedInCookie = request.cookies.get("edutogo-logged-in")?.value;

    if (!isLoggedInCookie || isLoggedInCookie !== "true") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/";
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

// Config matcher patterns
export const config = {
  matcher: ["/admin/:path*", "/student/:path*", "/settings/:path*"],
};
