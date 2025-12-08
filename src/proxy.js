// src/proxy.js
import { NextResponse } from "next/server";

export async function proxy(req) {
  const access = req.cookies.get("access_token");
  const refresh = req.cookies.get("refresh_token");

  const isAuthPage = req.nextUrl.pathname.startsWith("/login");
  const isAdmin = req.nextUrl.pathname.startsWith("/admin");
  const isAdminAsistente = req.nextUrl.pathname.startsWith("/adminAsistente");

  if (!access && !refresh && (isAdmin || isAdminAsistente)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!access && refresh) {
    const refreshURL = new URL("/api/auth/refresh", req.url);

    const res = await fetch(refreshURL);

    if (!res.ok) {
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }

    return NextResponse.next();
  }

  if (access && isAuthPage) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  if (!access && (isAdmin || isAdminAsistente)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/adminAsistente/:path*", "/login"],
};