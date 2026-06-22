import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import AuthService from "@/services/AuthService";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: (credentials) => AuthService.authenticate(credentials),
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
    authorized({ auth: session, request }) {
      const protectedPath =
        request.nextUrl.pathname.startsWith("/admin") ||
        request.nextUrl.pathname.startsWith("/api/admin");
      return !protectedPath || session?.user?.role === "admin";
    },
  },
});
