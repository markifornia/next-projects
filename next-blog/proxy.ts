import { NextRequest, NextResponse } from "next/server";

// Some common scenarios where Proxy is effective include:

// Modifying headers for all pages or a subset of pages
// Rewriting to different pages based on A/B tests or experiments
// Programmatic redirects based on incoming request properties

export function proxy(request:NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
    // matcher: "/about/:path*"
    matcher: [
        // Exclude API routes, static files, image optimizations, and .png files
        "/((?!api|_next/static|_next/image|.*\\.png$).*)",
    ]
}