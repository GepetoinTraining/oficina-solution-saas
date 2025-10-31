// src/lib/prisma.ts

import { PrismaClient } from '@prisma/client';

// Declara uma variável global para o cliente Prisma
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Cria a instância do cliente Prisma
// Se estiver em desenvolvimento, reutiliza a instância global existente
// Se estiver em produção, cria uma nova instância
const client = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = client;
}

export default client;