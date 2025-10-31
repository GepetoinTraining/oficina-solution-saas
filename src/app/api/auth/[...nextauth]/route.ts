// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/app/lib/prisma'; // Nosso singleton do Prisma!

export const authOptions = {
  // Configure o Prisma Adapter
  adapter: PrismaAdapter(prisma),

  // Configure os "Providers" (ex: Email/Senha, Google, etc.)
  providers: [
    CredentialsProvider({
      name: 'Email e Senha',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'seu@email.com' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        // LÓGICA DE LOGIN:
        // 1. Encontre o usuário no banco pelo email
        // 2. Compare a senha (usando bcrypt)
        // 3. Se for válido, retorne o objeto 'user'
        // 4. Se for inválido, retorne 'null'

        // --- Exemplo Simples (SUBSTITUIR PELA LÓGICA REAL) ---
        if (!credentials) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // AINDA FALTA: criptografar e comparar senhas (ex: com 'bcrypt')
        // Por enquanto, apenas para teste:
        if (user) {
          // No futuro, aqui você compararia a senha
          return user; // Login bem-sucedido
        } else {
          return null; // Falha no login
        }
      },
    }),
    // TODO: Adicionar outros providers (Google, Mercado Pago, etc.)
  ],

  // Estratégia de Sessão
  session: {
    strategy: 'jwt', // Recomendado para o Prisma Adapter
  },

  // Variável de ambiente (Passo 6)
  secret: process.env.AUTH_SECRET,

  // Callbacks (para adicionar o 'id' do usuário à sessão)
  callbacks: {
    async jwt({ token, user }) {
      // Na primeira vez (login), 'user' é passado.
      // Adicione o ID do usuário ao token JWT.
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Adicione o ID do token JWT ao objeto da sessão (disponível no cliente)
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };