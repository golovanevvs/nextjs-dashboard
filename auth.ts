import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import dotenv from "dotenv"
import {Client, QueryResult} from 'pg';

dotenv.config();
export const client = new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: Number(process.env.PG_PORT),
});

async function getUser(email: string): Promise<User | undefined> {
    client.connect()
    try {
      const user: QueryResult<User> = await client.query(`
        SELECT * FROM users
        WHERE email=$1`, [email]);
      return user.rows[0];
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw new Error('Failed to fetch user.');
    }
  }

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)
          if (parsedCredentials.success) {
            const { email, password } = parsedCredentials.data;
            const user = await getUser(email);
            if (!user) return null;
            const passwordsMatch = await bcrypt.compare(password, user.password);
            if (passwordsMatch) return user;
          }
          console.log('Invalid credentials');
          return null
      },
    }),
  ],
})
