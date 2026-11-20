import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/question/:id",
  "/tags",
  "/tags/:id",
  "/profile/:id",
  "/community",
  "/jobs",
]);

export default clerkMiddleware(async (auth, request) => {
  if (request.nextUrl.pathname === "/profile/edit" || !isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!api/webhook/?$|_next|.+\\.[\\w]+$).*)",
    "/(api|trpc)/((?!webhook/?$).*)",
  ],
};
