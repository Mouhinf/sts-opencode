import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const publicPaths = ["/admin/login", "/api/auth", "/_next", "/favicon", "/og-image"];
  
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }
  
  if (pathname.startsWith("/admin/dashboard")) {
    const session = request.cookies.get("admin_session");
    
    if (!session?.value) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};