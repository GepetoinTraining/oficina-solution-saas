// src/types/next-auth.d.ts

import 'next-auth';
import 'next-auth/jwt';
import { DefaultSession, DefaultUser } from 'next-auth';

// 1. Estenda o tipo 'Session'
declare module 'next-auth' {
  /**
   * O objeto 'session.user' agora terá a propriedade 'id'.
   */
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user']; // Mantém as propriedades padrão (name, email, image)
  }

  /**
   * O objeto 'user' retornado pelo 'authorize'
   * (DefaultUser já inclui 'id', mas você pode adicionar mais campos do seu Prisma User aqui)
   */
  interface User extends DefaultUser {
    // Ex: Se o seu model User no Prisma tiver um 'role'
    // role: string;
  }
}

// 2. Estenda o tipo 'JWT'
declare module 'next-auth/jwt' {
  /**
   * O token JWT agora terá a propriedade 'id'.
   */
  interface JWT {
    id: string;
  }
}