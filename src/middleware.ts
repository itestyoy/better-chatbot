import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { NEXT_PUBLIC_BASE_PATH } from "lib/const";

export async function middleware(request: NextRequest) {
 const { pathname } = request.nextUrl;

 if (pathname.includes('_next/static') || 
     pathname.includes('_next/image') ||
     pathname.includes('favicon.ico') ||
     pathname.includes('sitemap.xml') ||
     pathname.includes('robots.txt')) {
   return NextResponse.next();
 }

 /*
  * Playwright starts the dev server and requires a 200 status to
  * begin the tests, so this ensures that the tests can start
  */
 if (pathname.startsWith("/ping")) {
   return new Response("pong", { status: 200 });
 }

 if (!pathname.startsWith(NEXT_PUBLIC_BASE_PATH)) {
   return NextResponse.next();
 }

 const skipPaths = [
   `${NEXT_PUBLIC_BASE_PATH}/api/auth`,
   `${NEXT_PUBLIC_BASE_PATH}/sign-in`, 
   `${NEXT_PUBLIC_BASE_PATH}/sign-up`
 ];

 if (skipPaths.some(path => pathname.startsWith(path))) {
   return NextResponse.next();
 }

 const sessionCookie = getSessionCookie(request);
 if (!sessionCookie) {
   return NextResponse.redirect(new URL(NEXT_PUBLIC_BASE_PATH + "/sign-in", request.url));
 }
 
 return NextResponse.next();
}

export const config = {
 matcher: ['/(.*)', '/ping'],
};