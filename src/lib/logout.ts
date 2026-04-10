"use client";

import Cookies from "js-cookie";
import useAuthCredentialsStore, {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  SESSION_ID_COOKIE,
  USERNAME_COOKIE,
  FIRSTNAME_COOKIE,
  LASTNAME_COOKIE,
  EMAIL_COOKIE,
} from "@/state/use-auth-credentials-store";

const AUTH_COOKIES = [
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  SESSION_ID_COOKIE,
  USERNAME_COOKIE,
  FIRSTNAME_COOKIE,
  LASTNAME_COOKIE,
  EMAIL_COOKIE,
];

export function performLogout(redirectTo = "/login") {
  // Clear Zustand store
  useAuthCredentialsStore.getState().clearCredentials();

  if (typeof window !== "undefined") {
    // Clear auth cookies explicitly
    for (const name of AUTH_COOKIES) {
      Cookies.remove(name, { path: "/" });
    }

    // Clear persisted auth from localStorage
    try {
      window.localStorage.removeItem("chatview-auth-credentials-storage");
    } catch {
      // localStorage may not be available
    }

    // Clear any pending subscription state
    try {
      window.localStorage.removeItem("chatview_confirmed_plan");
    } catch {
      // localStorage may not be available
    }

    if (window.location.pathname !== redirectTo && !window.location.pathname.startsWith("/login")) {
      window.location.href = redirectTo;
    }
  }
}