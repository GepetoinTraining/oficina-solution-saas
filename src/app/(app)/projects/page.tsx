// src/app/(app)/projects/page.tsx
import { Title } from '@mantine/core';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/app/lib/prisma';
import { redirect } from 'next/navigation';
import { ProductionKanban } from './_components/ProductionKanban'; // Criaremos este
import { ProjectStatus } from '@prisma/client';

// Lista de status que pertencem ao pipeline de produção
const productionStatuses: ProjectStatus[] = [
  'PRODUCTION_BACKLOG',
  'MATERIALS_ORDERED',
  'MATERIALS_IN_STOCK',
  'CUTTING',
  'EDGE_BANDING',
  'PRE_ASSEMBLY',
  'INSTALLATION',
  'COMPLETED',
  'ON_HOLD',
];

// Função para buscar os dados de produção
async function getProductionData(userId: string) {
  if (!userId) {
    return { projects: [] };
  }

  const projects = await prisma.project.findMany({
    where: {
      client: {
        userId: userId,
      },
      status: {
        in: productionStatuses, // Busca apenas status de produção
      },
    },
    include: {
      client: true,
      architect: true,
    },
    orderBy: {
      projectPriority: 'desc', // Prioriza os mais importantes
    },
  });

  return { projects };
}

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/auth/login');
  }

  const { projects } = await getProductionData(session.user.id);

  return (
    <>
      <Title order={2} mb="lg">
        Pipeline de Produção
      </Title>
      
      {/* (Em breve) Passará os dados para o Kanban de Produção */}
      <ProductionKanban initialProjects={projects} />
    </>
  );
}