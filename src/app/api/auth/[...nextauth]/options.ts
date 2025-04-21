import { NextAuthOptions } from "next-auth";
// import CredentialsP from "next-auth/providers/credentials";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        email: credentials.email
                    });
                    if (!user) throw new Error('No user found with this email');

                    if (!user.isVerified) throw new Error('Please verify your account before logging in');

                    if (bcrypt.compareSync(credentials.password, user.password)) return user;
                    else throw new Error('Incorrect password');
                } catch (err: any) {
                    throw new Error(err);
                }
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id
                session.user.username = token.username
                session.user.isAcceptingMessage = token.isAcceptingMessage
                session.user.isVerified = token.isVerified
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.username = user.username;
                token.isAcceptingMessage = user.isAcceptingMessage;
                token.isVerified = user.isVerified;
            }
            return token
        }
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXT_AUTH_SECRET
}