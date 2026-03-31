import type { NextAuthOptions } from "next-auth";
import AzureADB2CProvider from "next-auth/providers/azure-ad-b2c";
import CredentialsProvider from "next-auth/providers/credentials";

const chatViewBaseUrl = (process.env.CHATVIEW_API_BASE_URL ?? "https://api.chat-view.xyz/api/v1").replace(/\/+$/, "");

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "ChatView",
      credentials: {
        login: { label: "Email or username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const login = String(credentials?.login ?? "").trim();
        const password = String(credentials?.password ?? "");

        if (!login || !password) {
          throw new Error("Missing credentials");
        }

        const response = await fetch(`${chatViewBaseUrl}/accounts/login/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(process.env.CHATVIEW_API_KEY ? { "X-API-KEY": process.env.CHATVIEW_API_KEY } : {}),
          },
          body: JSON.stringify({ login, password }),
        });

        const data = (await response.json().catch(() => null)) as Record<string, unknown> | null;

        if (!response.ok || !data) {
          throw new Error((data?.error as string) || (data?.detail as string) || "Invalid login");
        }

        const user = data.user as Record<string, unknown> | undefined;
        const tokens = data.tokens as Record<string, unknown> | undefined;
        const accessToken = tokens?.access_token as string | undefined;

        if (!user || !accessToken) {
          throw new Error("Invalid login response");
        }

        const firstName = String(user.firstname ?? "");
        const lastName = String(user.lastname ?? "");

        return {
          id: String(user.id ?? ""),
          name: `${firstName} ${lastName}`.trim() || String(user.username ?? ""),
          email: String(user.email ?? ""),
          username: String(user.username ?? ""),
          backendAccessToken: accessToken,
          backendRefreshToken: (tokens?.refresh_token as string | undefined) ?? null,
          providerType: "credentials",
        };
      },
    }),
    AzureADB2CProvider({
      clientId: process.env.AZURE_B2C_CLIENT_ID ?? "",
      clientSecret: process.env.AZURE_B2C_CLIENT_SECRET ?? "",
      tenantId: process.env.AZURE_B2C_TENANT_NAME ?? "",
      primaryUserFlow: process.env.AZURE_B2C_PRIMARY_USER_FLOW ?? "",
      authorization: {
        params: {
          scope: process.env.AZURE_B2C_SCOPE ?? "openid profile email",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === "azure-ad-b2c") {
        token.azureAccessToken = account.access_token;
        token.providerType = "azure-ad-b2c";
      }

      if (user) {
        token.providerType = (user as { providerType?: string }).providerType ?? token.providerType;
        token.backendAccessToken = (user as { backendAccessToken?: string }).backendAccessToken ?? token.backendAccessToken;
        token.backendRefreshToken =
          (user as { backendRefreshToken?: string | null }).backendRefreshToken ?? token.backendRefreshToken;
        token.username = (user as { username?: string }).username ?? token.username;
      }

      return token;
    },
    async session({ session, token }) {
      session.providerType = token.providerType as string | undefined;
      session.backendAccessToken = token.backendAccessToken as string | undefined;
      session.backendRefreshToken = token.backendRefreshToken as string | undefined;
      session.azureAccessToken = token.azureAccessToken as string | undefined;
      if (session.user) {
        session.user.username = token.username as string | undefined;
      }
      return session;
    },
  },
};
