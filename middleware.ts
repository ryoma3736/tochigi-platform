import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/register", "/companies", "/api/register"];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Admin routes
  const isAdminRoute = pathname.startsWith("/admin");

  // Business dashboard routes
  const isBusinessRoute = pathname.startsWith("/dashboard");

  // If not logged in and trying to access protected route
  if (!isLoggedIn && !isPublicRoute) {
    const callbackUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, req.url)
    );
  }

  // If logged in and trying to access login/register
  if (isLoggedIn && (pathname === "/login" || pathname === "/register")) {
    if (userRole === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    } else if (userRole === "business") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } else {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Admin route protection
  if (isAdminRoute && userRole !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Business dashboard protection
  if (isBusinessRoute && userRole !== "business") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
