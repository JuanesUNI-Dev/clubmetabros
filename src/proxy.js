// CAMBIO TEMPORAL HASTA QUE LE PIDA A CRISTIAN UN ENDPOINT DE GET ME 


// src/proxy.js
import { NextResponse } from "next/server";

export async function proxy(req) {
  const access = req.cookies.get("access_token");
  const refresh = req.cookies.get("refresh_token");

  const isAuthPage = req.nextUrl.pathname.startsWith("/login");
  const isAdmin = req.nextUrl.pathname.startsWith("/admin");
  const isAdminAsistente = req.nextUrl.pathname.startsWith("/adminAsistente");

  // --- CASE 1: NO access y NO refresh → logout automático ---
  if (!access && !refresh && (isAdmin || isAdminAsistente)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // --- CASE 2: NO access pero SÍ refresh → intentar regenerar ---
  if ((!access && refresh) || ((isAdmin || isAdminAsistente) && refresh)) {
    const refreshURL = new URL("https://backdemet.bskcfv.online/intern/refresh");

    const res = await fetch(refreshURL, {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: `refresh_token=${refresh.value};`
      }
    });

    // --- CASE 2.1: refresh token inválido (expiró o corrupto) ---
    if (!res.ok) {
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }

    // --- CASE 2.2: refresh token válido → obtener cookies nuevas ---
    const response = NextResponse.next();
    const setCookie = res.headers.get("set-cookie");
    if (setCookie) response.headers.append("set-cookie", setCookie);
    return response;
  }

  // --- CASE 3: Usuario autenticado intentando abrir /login ---
  if (access && isAuthPage) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // --- CASE 4: Usuario sin access intentando entrar a /admin ---
  if (!access && (isAdmin || isAdminAsistente)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/adminAsistente/:path*", "/login"],
};
