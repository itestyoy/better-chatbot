import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { NEXT_PUBLIC_BASE_PATH } from "lib/const";

const basePath = NEXT_PUBLIC_BASE_PATH.replace("/", "");

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /*
   * Playwright starts the dev server and requires a 200 status to
   * begin the tests, so this ensures that the tests can start
   */
  if (pathname.startsWith("/ping")) {
    return new Response("pong", { status: 200 });
  }
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL(NEXT_PUBLIC_BASE_PATH + "/sign-in", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    `/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|${basePath}/api/auth|${basePath}/sign-in|${basePath}/sign-up).*)`,
  ],
};