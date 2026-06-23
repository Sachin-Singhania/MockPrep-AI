import GoogleProvider from "next-auth/providers/google"
import { DefaultSession, SessionStrategy } from "next-auth"
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
        console.log("reached here 1")
        if (user) {
           console.log("reached here 2")
          const exsistingUser = await prisma.user.findUnique({
            where: { email: user.email }, include: {
              dashboards:
                { select: { id: true } }
            }
          });
          console.log(exsistingUser);
          let userId;
          let dashboardId;
          console.log("reached here 3")
          if (!exsistingUser) {
            const newUser = await prisma.user.create({
              data: {
                name: token.name,
                email: token.email, googleID: token.sub, tokenExpiry: token.exp, image: token.picture, dashboards: { create: {
                    Activity :{
                        create: {
                            content: {
                                date: new Date()
                            },
                            type: "DASHBOARD_CREATED"
                        }
                    }
                } },
              }, include: {
                dashboards:
                  { select: { id: true } }
              }
            });
            userId = newUser.id
            dashboardId = newUser.dashboards?.id;
            console.log("reached here 4")
          } else {
            console.log("reached here 5")
            await prisma.user.update({
              where: { email: user.email },
              data: {
                googleID: token.sub, tokenExpiry: token.exp,
              },
            })
            userId = exsistingUser.id;
            dashboardId = exsistingUser.dashboards?.id;
            console.log("reached here 6")
          }
          token.id = user.sub ?? token.sub;
          token.name = user.name;
          token.email = user.email;
          token.userId = userId;
          token.dashboardId = dashboardId;
          console.log("reached here 7")
        }
        return token
      } catch (error) {
        console.log("Error while signing in:", error);
        throw new Error("Error while signing in : Error " + error);
      }
    },
    async session({ session, token }: any) {
      session.user = {
        ...session.user,
        userId: token.userId,
        dashboardId: token.dashboardId
      };
      console.log("Session created:", session);
      return session;
    },
    // async signIn() {
    //   const ip = (await headers()).get('x-forwarded-for') ?? 'unknown';
    //   const { success } = await signin_rate_limit.limit(ip);
    //   console.log(`Request from IP: ${ip}`);
    //   if (!success) {
    //     return false;
    //   }
    //   return true;
    // }, 
  },
}