"use client";

import Cookies from "js-cookie";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const COOKIE_PREFIX = "chatview";
const ACCESS_TOKEN_COOKIE = `${COOKIE_PREFIX}_access_token`;
const REFRESH_TOKEN_COOKIE = `${COOKIE_PREFIX}_refresh_token`;
const SESSION_ID_COOKIE = `${COOKIE_PREFIX}_session_id`;
const USERNAME_COOKIE = `${COOKIE_PREFIX}_username`;
const FIRSTNAME_COOKIE = `${COOKIE_PREFIX}_firstname`;
const LASTNAME_COOKIE = `${COOKIE_PREFIX}_lastname`;
const EMAIL_COOKIE = `${COOKIE_PREFIX}_email`;

const baseCookieOptions = {
  path: "/",
  expires: 7,
  sameSite: "lax" as const,
  ...(process.env.NODE_ENV === "production" ? { secure: true } : {}),
};

type AuthCredentials = {
  accessToken?: string | null;
  refreshToken?: string | null;
  sessionId?: string | null;
  username?: string | null;
  firstname?: string | null;
  lastname?: string | null;
  email?: string | null;
};

type AuthCredentialsState = {
  accessToken: string | null;
  refreshToken: string | null;
  sessionId: string | null;
  username: string | null;
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  hasHydrated: boolean;
  setCredentials: (credentials: AuthCredentials) => void;
  clearCredentials: () => void;
  loadFromCookies: () => void;
  getAccessToken: () => string | null;
  markHydrated: () => void;
};

function syncCookie(name: string, value: string | null | undefined) {
  if (value) {
    Cookies.set(name, value, baseCookieOptions);
    return;
  }

  Cookies.remove(name, { path: "/" });
}

const useAuthCredentialsStore = create<AuthCredentialsState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      sessionId: null,
      username: null,
      firstname: null,
      lastname: null,
      email: null,
      hasHydrated: false,
      setCredentials: (credentials) => {
        const updates: Partial<AuthCredentialsState> = {};

        if (credentials.accessToken !== undefined) updates.accessToken = credentials.accessToken;
        if (credentials.refreshToken !== undefined) updates.refreshToken = credentials.refreshToken;
        if (credentials.sessionId !== undefined) updates.sessionId = credentials.sessionId;
        if (credentials.username !== undefined) updates.username = credentials.username;
        if (credentials.firstname !== undefined) updates.firstname = credentials.firstname;
        if (credentials.lastname !== undefined) updates.lastname = credentials.lastname;
        if (credentials.email !== undefined) updates.email = credentials.email;

        set(updates);

        if (credentials.accessToken !== undefined) syncCookie(ACCESS_TOKEN_COOKIE, credentials.accessToken);
        if (credentials.refreshToken !== undefined) syncCookie(REFRESH_TOKEN_COOKIE, credentials.refreshToken);
        if (credentials.sessionId !== undefined) syncCookie(SESSION_ID_COOKIE, credentials.sessionId);
        if (credentials.username !== undefined) syncCookie(USERNAME_COOKIE, credentials.username);
        if (credentials.firstname !== undefined) syncCookie(FIRSTNAME_COOKIE, credentials.firstname);
        if (credentials.lastname !== undefined) syncCookie(LASTNAME_COOKIE, credentials.lastname);
        if (credentials.email !== undefined) syncCookie(EMAIL_COOKIE, credentials.email);
      },
      clearCredentials: () => {
        set({
          accessToken: null,
          refreshToken: null,
          sessionId: null,
          username: null,
          firstname: null,
          lastname: null,
          email: null,
        });

        syncCookie(ACCESS_TOKEN_COOKIE, null);
        syncCookie(REFRESH_TOKEN_COOKIE, null);
        syncCookie(SESSION_ID_COOKIE, null);
        syncCookie(USERNAME_COOKIE, null);
        syncCookie(FIRSTNAME_COOKIE, null);
        syncCookie(LASTNAME_COOKIE, null);
        syncCookie(EMAIL_COOKIE, null);
      },
      loadFromCookies: () => {
        const state = get();
        if (state.accessToken) {
          return;
        }

        const accessToken = Cookies.get(ACCESS_TOKEN_COOKIE) ?? null;
        if (!accessToken) {
          return;
        }

        set({
          accessToken,
          refreshToken: Cookies.get(REFRESH_TOKEN_COOKIE) ?? null,
          sessionId: Cookies.get(SESSION_ID_COOKIE) ?? null,
          username: Cookies.get(USERNAME_COOKIE) ?? null,
          firstname: Cookies.get(FIRSTNAME_COOKIE) ?? null,
          lastname: Cookies.get(LASTNAME_COOKIE) ?? null,
          email: Cookies.get(EMAIL_COOKIE) ?? null,
        });
      },
      getAccessToken: () => {
        const state = get();
        if (state.accessToken) {
          return state.accessToken;
        }

        const accessToken = Cookies.get(ACCESS_TOKEN_COOKIE) ?? null;
        if (accessToken) {
          set({ accessToken });
        }

        return accessToken;
      },
      markHydrated: () => {
        set({ hasHydrated: true });
      },
    }),
    {
      name: "chatview-auth-credentials-storage",
      storage: typeof window !== "undefined" ? createJSONStorage(() => window.localStorage) : undefined,
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        sessionId: state.sessionId,
        username: state.username,
        firstname: state.firstname,
        lastname: state.lastname,
        email: state.email,
      }),
      onRehydrateStorage: () => (state) => {
        state?.markHydrated();
      },
    },
  ),
);

if (typeof window !== "undefined") {
  const state = useAuthCredentialsStore.getState();
  state.loadFromCookies();
  window.setTimeout(() => {
    useAuthCredentialsStore.getState().loadFromCookies();
  }, 100);
}

export {
  ACCESS_TOKEN_COOKIE,
  EMAIL_COOKIE,
  FIRSTNAME_COOKIE,
  LASTNAME_COOKIE,
  REFRESH_TOKEN_COOKIE,
  SESSION_ID_COOKIE,
  USERNAME_COOKIE,
};

export default useAuthCredentialsStore;