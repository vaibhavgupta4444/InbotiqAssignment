
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get user data from cookie or check if authenticated
  const userCookie = request.cookies.get('user');
  const isAuthenticated = !!userCookie;

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/items'];
  const authRoutes = ['/sign-in', '/sign-up'];
  
  const { pathname } = request.nextUrl;

  // Handle root route
  if (pathname === '/') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  // Check if current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // Redirect to sign-in if trying to access protected route without authentication
  if (isProtectedRoute && !isAuthenticated) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect to dashboard if already authenticated and trying to access auth routes
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/items/:path*', '/sign-in', '/sign-up'],
};
