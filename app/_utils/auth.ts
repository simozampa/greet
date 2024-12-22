import CredentialsProvider from "next-auth/providers/credentials"
import { NextAuthOptions } from "next-auth"
import { db } from "./db"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { AnalyticsEventType, ApprovalStatus } from "@prisma/client"
import bcrypt from "bcryptjs"
import { Analytics } from "./analytics"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Credentials',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            type: 'credentials',
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith@email.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials.password) {
                    throw new Error("Invalid Email or Password");
                }

                if ((typeof credentials.email !== "string") || (typeof credentials.password !== "string")) {
                    throw new Error("Invalid Email or Password");
                }

                const user = await (db as any).user.findUnique({
                    where: {
                        email: credentials.email.toLowerCase()
                    },
                    include: {
                        role: true,
                        instagramAccount: true
                    }
                });

                if (!user) {
                    throw new Error("Invalid Email or Password");
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                )

                if (!isPasswordValid) {
                    throw new Error("Invalid Email or Password");
                }


                if (user.approvalStatus === ApprovalStatus.PENDING) {
                    throw new Error("This account has not yet been authorized. You will receive an email soon with the status of your application.");
                }

                if (user.approvalStatus === ApprovalStatus.UNSUCCESSFUL) {
                    throw new Error("Your account was not accepted to join our platform. If you think this was a mistake, please contact us.");
                }

                Analytics.trackDistinctIdEvent(
                    user.id,
                    "successful_log_in",
                    AnalyticsEventType.SUCCESS,
                    {
                        user_type: user.role.slug
                    }
                );

                // Any object returned will be saved in `user` property of the JWT
                // ^ This is not actually true 
                return user;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {

            if (!token.email) return token;

            const dbUser = await (db as any).user.findUnique({
                where: {
                    email: token.email.toLowerCase()
                },
                include: {
                    role: true,
                    instagramAccount: true
                }
            });

            // Instagram Account is for creators ONLY!
            if (dbUser.role?.slug === "creator") {
                token.instagramAccount = dbUser.instagramAccount ? dbUser.instagramAccount : undefined;
            }

            token.businessId = dbUser.businessId;
            token.id = dbUser.id;
            token.role = dbUser.role;
            token.name = dbUser.firstName + ' ' + dbUser.lastName;

            return token;
        },
        async session({ session, token }) {

            // Send properties to the client
            if (token && session.user) {
                session.user.role = token.role;
                session.user.businessId = token.businessId;
                session.user.id = token.id;
                session.user.instagramAccount = token.instagramAccount;
            }

            return session;
        }
    },
    session: {
        strategy: "jwt",
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
        maxAge: 60 * 60 * 24 * 30,
    },
    // This is a temporary fix for prisma client.
    // @see https://github.com/prisma/prisma/issues/16117
    adapter: PrismaAdapter(db as any),
    pages: {
        signIn: '/login',
    },
}