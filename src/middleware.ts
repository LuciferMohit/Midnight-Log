import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Add /dev-login to public routes so you can access it
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/dev-login']);

export default clerkMiddleware(async (auth, req) => {
  // 1. Check for Dev Cookie
  const devToken = req.cookies.get("midnight-dev-token");

  if (devToken && devToken.value === "authorized") {
    // BYPASS: Allow access immediately
    return NextResponse.next();
  }

  // 2. Normal Clerk Protection
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
