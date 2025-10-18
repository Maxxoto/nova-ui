import NextAuth, { Session, DefaultSession } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

const auth0Provider = Auth0Provider({
  clientId: process.env.AUTH0_CLIENT_ID!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!,
  issuer: process.env.AUTH0_ISSUER_BASE_URL,
});

export const authOptions = {
  providers: [auth0Provider],
  callbacks: {
    async session({ session, token }: { session: Session; token: { sub?: string } }) {
      // Send properties to the client, like an access_token from a provider
      if (session.user && token.sub) {
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/", // Redirect to home page for sign in
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
