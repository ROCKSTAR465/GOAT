import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY || 'your-secret-key-min-32-characters-long'
);

// Public paths that don't require authentication
const publicPaths = ['/login', '/signup', '/', '/welcome', '/api/auth'];

// Role-based path restrictions
const rolePaths = {
  employee: ['/dashboard/employee', '/api/employee'],
  executive: ['/dashboard/executive', '/api/executive'],
};

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Allow public paths
  if (publicPaths.some(publicPath => path.startsWith(publicPath))) {
    return NextResponse.next();
  }

  // Allow static files and API routes that don't need auth
  if (path.startsWith('/_next') || path.startsWith('/api/public')) {
    return NextResponse.next();
  }

  // Get token from cookie
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    // No token, redirect to login
    if (path.startsWith('/api')) {
      return NextResponse.json(
        { code: 401, message: 'Authentication required' },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verify token
  const payload = await verifyToken(token);
  
  if (!payload) {
    // Invalid token
    if (path.startsWith('/api')) {
      return NextResponse.json(
        { code: 401, message: 'Invalid authentication token' },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check role-based access
  const userRole = payload.role as string;
  const userId = payload.userId as string;

  // Check if user is accessing their role-specific paths
  if (path.startsWith('/dashboard/employee') || path.startsWith('/api/employee')) {
    if (userRole !== 'employee') {
      if (path.startsWith('/api')) {
        return NextResponse.json(
          { code: 403, message: 'Access forbidden: Employee role required' },
          { status: 403 }
        );
      }
      return NextResponse.redirect(new URL('/dashboard/executive', request.url));
    }
  }

  if (path.startsWith('/dashboard/executive') || path.startsWith('/api/executive')) {
    if (userRole !== 'executive') {
      if (path.startsWith('/api')) {
        return NextResponse.json(
          { code: 403, message: 'Access forbidden: Executive role required' },
          { status: 403 }
        );
      }
      return NextResponse.redirect(new URL('/dashboard/employee', request.url));
    }
  }

  // Add user info to headers for API routes
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', userId);
  requestHeaders.set('x-user-role', userRole);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};

