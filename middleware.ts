import { constants, createRedirect } from '@clerk/backend/internal';
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';

import { isPublicRoute } from './app/_helpers/helpers';
import { authToken } from './actions/auth';

// This Middleware does not protect any routes by default.
// See https://clerk.com/docs/references/nextjs/clerk-middleware for more information about configuring your Middleware
export default clerkMiddleware(
  async (auth, req) => {
    // accept-language will override the defaultLocale, so we need to remove it
    req.headers.set('accept-language', '');

    const { userId } = auth();
    
    if (isPublicRoute(req)) {
      return;
    }

    // Handle users who aren't authenticated
    if (!userId && !isPublicRoute(req)) {
      const { redirectToSignIn } = createRedirect({
        redirectAdapter: (url: string) => {
          const response = NextResponse.redirect(url);
          // remove custom cookies (user and company id) when redirecting to sign in
          response.cookies.delete('c_id');
          response.cookies.delete('u_id');
          
          response.headers.set(constants.Headers.ClerkRedirectTo, 'true');
          return response;
        },
        signInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
        signUpUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
        publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '',
        baseUrl: '',
      });
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    const currentUserId = req.cookies.get('u_id')?.value;
    let u_id: string | null = null;

    if (userId && userId !== currentUserId) {
      u_id = userId;
    }

    const response = NextResponse.next();

    // Demo code to show getting auth token from cookies.
    // In real app we have protected endpoint called from this place, that uses "__session" token to authenticate.
    authToken();
    
    if (u_id) {
      response.cookies.set({ name: 'u_id', value: u_id, path: '/' });
    }

    return response;
  },
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
