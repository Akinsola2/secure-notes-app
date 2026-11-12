import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error("Missing Supabase environment variables.");
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoginPage = request.nextUrl.pathname === "/login";
  const isForgotPasswordPage =
    request.nextUrl.pathname === "/forgot-password";
  const isAuthCallback = request.nextUrl.pathname === "/auth/callback";

  if (!user && !isLoginPage && !isForgotPasswordPage && !isAuthCallback) {
    return redirectWithCookies("/login");
  }

  if (user && (isLoginPage || isForgotPasswordPage)) {
    return redirectWithCookies("/");
  }

  return setNoStore(response);

  function redirectWithCookies(path: string) {
    const redirectResponse = NextResponse.redirect(
      new URL(path, request.url),
    );
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });
    return setNoStore(redirectResponse);
  }

  function setNoStore(target: NextResponse) {
    target.headers.set(
      "Cache-Control",
      "private, no-store, no-cache, max-age=0, must-revalidate",
    );
    target.headers.set("Pragma", "no-cache");
    target.headers.set("Expires", "0");
    return target;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
