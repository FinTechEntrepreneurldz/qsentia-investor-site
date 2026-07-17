import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function safeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/user";
  return value;
}

const PREVIEW_COOKIE = "qsentia_local_preview";

function isLocalRequest(request: NextRequest) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const hostHeader = forwardedHost || request.headers.get("host") || "";
  const hostname = hostHeader.split(":")[0].toLowerCase();
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const response = NextResponse.next();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const adminPage = pathname.startsWith("/admin");
  const adminApi = pathname.startsWith("/api/admin");
  const userPage = pathname.startsWith("/user");
  const customerPage = pathname.startsWith("/dashboard") || pathname.startsWith("/customer");
  const customerApi = pathname.startsWith("/api/customer");
  const protectedPage = adminPage || userPage || customerPage;
  const protectedApi = adminApi || customerApi;
  const previewEnabled = isLocalRequest(request) && request.cookies.get(PREVIEW_COOKIE)?.value === "1";

  if (previewEnabled && (userPage || customerPage || customerApi)) {
    return response;
  }

  if (previewEnabled && pathname === "/signin") {
    return NextResponse.redirect(new URL(safeNextPath(request.nextUrl.searchParams.get("next")), request.url));
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    if (protectedApi) {
      return NextResponse.json(
        { error: "Authentication is not configured" },
        { status: 503, headers: { "Cache-Control": "no-store" } },
      );
    }

    if (protectedPage) {
      const signin = new URL("/signin", request.url);
      signin.searchParams.set("next", pathname);
      signin.searchParams.set("error", "auth_not_configured");
      return NextResponse.redirect(signin);
    }

    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (protectedApi && !user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (protectedPage && !user) {
    const signin = new URL("/signin", request.url);
    signin.searchParams.set("next", pathname);
    return NextResponse.redirect(signin);
  }

  // redirect signed in users away from signin page
  if (pathname === "/signin" && user) {
    return NextResponse.redirect(new URL(safeNextPath(request.nextUrl.searchParams.get("next")), request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/dashboard/:path*", "/user/:path*", "/customer/:path*", "/api/customer/:path*", "/signin"],
};
