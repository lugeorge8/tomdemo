import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/blog/admin")) {
    const authed = req.cookies.get("tomdemo_admin")?.value === "1";
    if (!authed) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin-login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/blog/admin/:path*"],
};
