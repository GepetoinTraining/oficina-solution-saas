// src/app/(app)/sales/page.tsx
import { Title } from '@mantine/core';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/app/lib/prisma';
import { ProjectStatus } from '@prisma/client';
import { SalesKanban } from './_components/SalesKanban';
import { redirect } from 'next/navigation';

// Função para buscar todos os dados da pipeline de vendas
async function getSalesData(userId: string) {
  if (!userId) {
    return { projects: [], clients: [], architects: [] };
  }

  // 1. Busca projetos que estão na fase de Vendas
  const projects = await prisma.project.findMany({
    where: {
      client: {
        userId: userId, // <-- Correção: Filtra através do relacionamento
      },
      status: {
        in: ['LEAD', 'CONTACTED', 'QUOTED', 'NEGOTIAÇÃO'],
      },
    },
    include: {
      client: true, // Inclui o cliente
      architect: true, // Inclui o arquiteto (se houver)
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // 2. Busca todos os clientes e arquitetos (para o modal "Novo Lead")
  const clients = await prisma.client.findMany({ where: { userId } });
  const architects = await prisma.architect.findMany({ where: { userId } });

  return { projects, clients, architects };
}

export default async function SalesPage() {
  const session = await getServerSession(authOptions);

  // Se não houver sessão, o layout (app) já deve ter redirecionado,
  // mas é uma boa prática verificar.
  if (!session?.user?.id) {
    redirect('/auth/login');
  }

  const { projects, clients, architects } = await getSalesData(session.user.id);

  return (
    <>
      <Title order={2} mb="lg">
        Pipeline de Vendas
      </Title>

      {/* Passa os dados para o Client Component renderizar o Kanban */}
      <SalesKanban
        initialProjects={projects}
        clients={clients}
        architects={architects}
      />
    </>
  );
}