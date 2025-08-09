import GoogleProvider from "next-auth/providers/google"
import { DefaultSession, SessionStrategy } from "next-auth"
import { headers } from "next/headers";
import { signin_rate_limit } from "./redis";
import { prisma } from "./prisma";
declare module "next-auth" {
  interface Session {
    user?: DefaultSession["user"] & {
      userId?: string;
      dashboardId?: string;
    };
  }

  interface User {
    id: string;
  }

  interface JWT {
    userId?: string;
  }
}
export const authOptions = {
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }: any) {
      try {
        if (user) {
          const exsistingUser = await prisma.user.findUnique({
            where: { email: user.email }, include: {
              dashboards:
                { select: { id: true } }
            }
          });
          console.log(exsistingUser);
          let userId;
          let dashboardId;
          if (!exsistingUser) {
            const newUser = await prisma.user.create({
              data: {
                name: token.name,
                email: token.email, googleID: token.sub, tokenExpiry: token.exp, image: token.picture, dashboards: { create: {} },
              }, include: {
                dashboards:
                  { select: { id: true } }
              }
            });
            userId = newUser.id
            dashboardId = newUser.dashboards?.id;
          } else {
            await prisma.user.update({
              where: { email: user.email },
              data: {
                googleID: token.sub, tokenExpiry: token.exp,
              },
            })
            userId = exsistingUser.id;
            dashboardId = exsistingUser.dashboards?.id;
          }
          token.id = user.sub ?? token.sub;
          token.name = user.name;
          token.email = user.email;
          token.userId = userId;
          token.dashboardId = dashboardId;
        }
        return token
      } catch (error) {
        throw new Error("Error while signing in : Error " + error);
      }
    },
    async session({ session, token }: any) {
      session.user = {
        ...session.user,
        userId: token.userId,
        dashboardId: token.dashboardId
      };

      return session;
    },
    async signIn() {
      const ip = headers().get('x-forwarded-for') ?? 'unknown';
      const { success } = await signin_rate_limit.limit(ip);
      console.log(`Request from IP: ${ip}`);
      if (!success) {
        return false;
      }
      return true;
    }, pages: {
      signIn: '/signin',
    }
  }
}