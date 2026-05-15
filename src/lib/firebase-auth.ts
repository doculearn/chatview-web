"use client";

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  type Auth,
} from "firebase/auth";

// Public Firebase web config (safe to embed — gated by Authorized Domains).
const firebaseConfig = {
  apiKey: "AIzaSyA3ZA3R8AjRl7yTH4Yjd1FmXmagRjGmn38",
  authDomain: "chatview-doculearn.firebaseapp.com",
  projectId: "chatview-doculearn",
  storageBucket: "chatview-doculearn.firebasestorage.app",
  messagingSenderId: "157796964641",
  appId: "1:157796964641:web:e5181848d3109fe70e0660",
  measurementId: "G-X56LFWJYPP",
};

function getFirebaseApp(): FirebaseApp {
  if (getApps().length) return getApp();
  return initializeApp(firebaseConfig);
}

export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}

export class GoogleSignInCancelled extends Error {
  constructor() {
    super("Sign-in cancelled");
    this.name = "GoogleSignInCancelled";
  }
}

/**
 * Open a Google sign-in popup, exchange the resulting Firebase credential for
 * a ChatView session via the backend ``/auth/google/firebase/`` endpoint.
 */
export async function signInWithGoogleAndExchange(): Promise<{
  success: boolean;
  user?: Record<string, unknown>;
  tokens?: Record<string, unknown>;
  session_id?: string | null;
  subscription_active?: boolean;
  error?: string;
}> {
  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  let result;
  try {
    result = await signInWithPopup(auth, provider);
  } catch (err) {
    const code = (err as { code?: string })?.code ?? "";
    if (
      code === "auth/popup-closed-by-user" ||
      code === "auth/cancelled-popup-request" ||
      code === "auth/user-cancelled"
    ) {
      throw new GoogleSignInCancelled();
    }
    throw err;
  }

  const idToken = await result.user.getIdToken();

  const response = await fetch("/api/chatview/auth/google/firebase", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_token: idToken }),
  });

  const data = (await response.json().catch(() => null)) ?? {};
  if (!response.ok) {
    return {
      success: false,
      error: (data as { error?: string }).error || "Sign-in failed",
    };
  }

  return { success: true, ...(data as Record<string, unknown>) };
}
