// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface TokenPayload {
  role?: string;
  userId?: string;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export function middleware(request: NextRequest) {
  // ✅ Check for admin routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    // ✅ Get token from cookies (this now works!)
    const token = request.cookies.get("token")?.value;
    
    console.log('Middleware - Token from cookies:', token ? 'Present' : 'Missing');
    console.log('Middleware - Path:', request.nextUrl.pathname);

    // ✅ Get user role from token or cookies
    let userRole: string| undefined | null= request.cookies.get("userRole")?.value;
    
    // If role not in cookies, try to extract from JWT token
    if (!userRole && token) {
      userRole = getUserRoleFromToken(token);
    }

    console.log('Middleware - User role:', userRole);

    // ✅ If user is not admin, redirect to login
    if (userRole !== "admin") {
      console.log('Middleware - Access denied, redirecting to login');
      
      const loginUrl = new URL("/login", request.url);
      // Add redirect URL for after login
      loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    console.log('Middleware - Access granted for admin');
  }

  return NextResponse.next();
}

// ✅ Helper function to extract user role from JWT token
function getUserRoleFromToken(token: string): string | null {
  if (!token) return null;

  try {
    // JWT token has format: header.payload.signature
    const base64Payload = token.split(".")[1];
    if (!base64Payload) return null;

    // Handle base64url encoding (JWT standard)
    const payload = Buffer.from(
      base64Payload.replace(/-/g, '+').replace(/_/g, '/'), 
      'base64'
    ).toString();
    
    const decodedPayload: TokenPayload = JSON.parse(payload);
    console.log('Middleware - Decoded token payload:', decodedPayload);
    
    return decodedPayload.role || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

// ✅ Configure which routes the middleware should run on
export const config = {
  matcher: [
    "/dashboard/:path*",
    // Add other protected routes as needed
  ],
};