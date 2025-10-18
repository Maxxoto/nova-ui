import NextAuth from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";

const auth0Provider = Auth0Provider({
  clientId: process.env.AUTH0_CLIENT_ID!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!,
  issuer: process.env.AUTH0_ISSUER_BASE_URL,
});

export const authOptions = {
  providers: [auth0Provider],
  callbacks: {
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider
      session.user.id = token.sub;
      return session;
    },
  },
  pages: {
    signIn: "/", // Redirect to home page for sign in
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
