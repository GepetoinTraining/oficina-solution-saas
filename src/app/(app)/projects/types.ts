// src/app/(app)/projects/types.ts
import { Prisma } from '@prisma/client';

/**
 * Define um tipo para o Projeto que inclui
 * as relações com Cliente e Arquiteto.
 */
export type ProductionProject = Prisma.ProjectGetPayload<{
  include: {
    client: true;
    architect: true;
  };
}>;