// src/app/(app)/sales/[id]/actions.ts
'use server';

import prisma from '@/app/lib/prisma';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { authOptions } from '@/app/lib/auth';

// Estado de retorno
type FormState = {
  success: boolean;
  message: string;
};

// Schema
const notesSchema = z.object({
  projectId: z.string().cuid(),
  meetingNotes: z.string().min(1, 'Notas não podem ser vazias'),
});

export async function updateMeetingNotes(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: 'Não autorizado' };
  }

  const result = notesSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    return { success: false, message: 'Dados inválidos' };
  }

  const { projectId, meetingNotes } = result.data;

  try {
    // Verifica se o projeto pertence ao usuário
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        client: { userId: session.user.id },
      },
    });

    if (!project) {
      return { success: false, message: 'Projeto não encontrado' };
    }

    // Atualiza as notas
    await prisma.project.update({
      where: { id: projectId },
      data: { meetingNotes: meetingNotes },
    });

    revalidatePath(`/sales/${projectId}`); // Revalida a página do projeto
    revalidatePath(`/sales/${projectId}/print`); // Revalida a página de impressão
    return { success: true, message: 'Briefing salvo com sucesso' };
  } catch (error) {
    return { success: false, message: 'Erro ao salvar no banco de dados' };
  }
}