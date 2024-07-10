import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";


export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    secret: process.env.JWT_SECRET,
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            console.log('signIn callback', { user, account, profile, email, credentials });
          return true; // Do your custom validation here
        },
        async redirect({ url, baseUrl }) {
          return baseUrl; // Redirect to home after sign in
        },
        async session({ session, token, user }) {
          return session; // Return session object
        },
        async jwt({ token, user, account, profile, isNewUser }) {
          return token; // Return JWT token
        },
      },
})