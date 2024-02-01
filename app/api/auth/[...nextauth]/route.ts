import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    Credentials({
      name: "signin",
      credentials: {
        email: { label: "이메일", type: "text", placeholder: "example@kpop.com" },
        password: { label: "비밀번호", type: "password", placeholder: "영문, 숫자, 특수문자 포함 8자 이상 입력해주세요" },
      },
      async authorize(credentials, req) {
        const mock = { id: "1", name: "김하늘", email: "hankimm@example.com" };
        return mock;
      },
    }),
  ],
  callbacks: {
    async signIn({ profile, account }) {
      const isOAuth = !!account?.provider;
      if (isOAuth) {
        const signinData = {
          accessToken: account.access_token,
          email: profile?.email,
          signinMethod: account.provider,
        };

        const signinRes = await fetch("http://ec2-3-37-149-204.ap-northeast-2.compute.amazonaws.com:3000/authentication", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signinData),
        });

        if (signinRes.status === 400) {
          const signupData = { userName: profile?.name, signupMethod: account.provider, email: profile?.email, password: "00000000", passwordCheck: "00000000" };
          const signupRes = await fetch("http://ec2-3-37-149-204.ap-northeast-2.compute.amazonaws.com:3000/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(signupData),
          });
          const signupResult = await signupRes.json();
          account.local_accessToken = signupResult.accessToken;
          account.local_refreshToken = signupResult.refreshToken;
          return signupRes.status === 201 ? true : false;
        }

        const signinResult = await signinRes.json();
        account.local_accessToken = signinResult.accessToken;
        account.local_refreshToken = signinResult.refreshToken;
        return true;
      }
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.local_accessToken;
        token.refreshToken = account.local_refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      const { accessToken, refreshToken } = token;
      return { ...session, accessToken, refreshToken };
    },
  },
  pages: {
    signIn: "/signin",
  },
});

export { handler as GET, handler as POST };
