// src/app/(app)/sales/actions.ts
'use server';

import prisma from '@/app/lib/prisma';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ProjectStatus } from '@prisma/client';

// Estado de retorno para o useActionState
type FormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
};

// --- Schema para NOVO LEAD (Existente) ---
const createLeadSchema = z.object({
  name: z.string().min(3, 'Nome do projeto é obrigatório'),
  clientId: z.string().cuid('Cliente inválido'),
  architectId: z.string().cuid('Arquiteto inválido').optional().or(z.literal('')),
});

export async function createLeadProject(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: 'Não autorizado' };
  }

  const rawData = Object.fromEntries(formData);
  
  const dataToParse = {
    ...rawData,
    architectId: rawData.architectId || null,
  };

  const result = createLeadSchema.safeParse(dataToParse);
  if (!result.success) {
    return {
      success: false,
      message: 'Erro de validação',
      errors: result.error.flatten().fieldErrors,
    };
  }
  
  if (!dataToParse.architectId) {
    delete dataToParse.architectId;
  }

  try {
    await prisma.project.create({
      data: {
        ...(result.data as any), // Correção para lidar com 'architectId' opcional
        status: ProjectStatus.LEAD, 
      },
    });

    revalidatePath('/sales');
    return { success: true, message: 'Lead criado com sucesso' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Erro no banco de dados' };
  }
}

// --- NOVO: Schema e Ação para ATUALIZAR STATUS ---

const updateStatusSchema = z.object({
  projectId: z.string().cuid(),
  newStatus: z.nativeEnum(ProjectStatus),
});

export async function updateProjectStatus(data: {
  projectId: string;
  newStatus: ProjectStatus;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: 'Não autorizado' };
  }

  const result = updateStatusSchema.safeParse(data);
  if (!result.success) {
    return { success: false, message: 'Dados inválidos' };
  }

  const { projectId, newStatus } = result.data;

  try {
    // Para segurança, verificamos se o projeto pertence ao usuário
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        client: {
          userId: session.user.id,
        },
      },
    });

    if (!project) {
      return { success: false, message: 'Projeto não encontrado' };
    }

    // Atualiza o status
    await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        status: newStatus,
      },
    });

    revalidatePath('/sales');
    return { success: true, message: 'Status atualizado' };
  } catch (error) {
    return { success: false, message: 'Erro no banco de dados' };
  }
}