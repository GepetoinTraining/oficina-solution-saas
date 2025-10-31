// /src/types/next-auth.d.ts
import 'next-auth';
import { DefaultSession, DefaultUser } from 'next-auth';

// 1. Estenda o tipo 'User' padrão
declare module 'next-auth' {
  /**
   * O 'User' do seu banco de dados (vem do authorize)
   */
  interface User extends DefaultUser {
    id: string; // Adicione o 'id' que vem do seu banco
  }

  /**
   * O objeto 'Session' disponível no cliente
   */
  interface Session extends DefaultSession {
    user: {
      id: string; // Adicione o 'id' ao 'user' da sessão
    } & DefaultSession['user']; // Preserva as propriedades padrão (name, email, image)
  }
}

// 2. Estenda o tipo do JWT
declare module 'next-auth/jwt' {
  /**
   * O token JWT
   */
  interface JWT {
    id: string; // Adicione o 'id' aqui também
  }
}