import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    providerType?: string;
    backendAccessToken?: string;
    backendRefreshToken?: string;
    azureAccessToken?: string;
    user?: DefaultSession["user"] & {
      username?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    providerType?: string;
    backendAccessToken?: string;
    backendRefreshToken?: string | null;
    azureAccessToken?: string;
    username?: string;
  }
}
