import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!api/webhook/?$|_next|.+\\.[\\w]+$).*)",
    "/(api|trpc)/((?!webhook/?$).*)",
  ],
};
