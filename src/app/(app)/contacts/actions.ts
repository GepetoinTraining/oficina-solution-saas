'use server';

import prisma from '@/app/lib/prisma';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { authOptions } from '@/app/lib/auth'; // <-- This path is now correct
import { ClientIncomeLevel, PriceSensitivity } from '@prisma/client';

// --- Estado Genérico de Retorno ---
type FormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
};

// --- Ações do Cliente ---

const clientSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Nome do cliente é obrigatório'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  addressStreet: z.string().optional(),
  addressNumber: z.string().optional(),
  addressNeighborhood: z.string().optional(),
  addressCity: z.string().optional(),
  addressState: z.string().optional(),
  addressZipCode: z.string().optional(),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  linkedinProfile: z.string().url('URL inválida').optional().or(z.literal('')),
  instagramProfile: z.string().url('URL inválida').optional().or(z.literal('')),
  priceSensitivity: z.nativeEnum(PriceSensitivity).optional().nullable(),
  incomeLevel: z.nativeEnum(ClientIncomeLevel).optional().nullable(),
  leadSource: z.string().optional(),
  notes: z.string().optional(),
});

export async function upsertClient(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: 'Não autorizado' };
  }

  const rawData = Object.fromEntries(formData);

  // Converte valores vazios de Enums para 'null'
  const dataToParse = {
    ...rawData,
    priceSensitivity: rawData.priceSensitivity || null,
    incomeLevel: rawData.incomeLevel || null, // <-- THE FIX IS HERE (was 'raw.')
  };

  const result = clientSchema.safeParse(dataToParse);
  if (!result.success) {
    return {
      success: false,
      message: 'Erro de validação',
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { id, ...data } = result.data;

  try {
    if (id) {
      // Atualizar
      await prisma.client.update({
        where: { id: id, userId: session.user.id },
        data,
      });
    } else {
      // Criar
      await prisma.client.create({
        data: {
          ...data,
          userId: session.user.id,
        },
      });
    }

    revalidatePath('/contacts');
    return { success: true, message: 'Cliente salvo com sucesso' };
  } catch (error) {
    return { success: false, message: 'Erro de banco de dados' };
  }
}

// --- Ações do Arquiteto ---

const architectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Nome do arquiteto é obrigatório'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
});

export async function upsertArchitect(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: 'Não autorizado' };
  }

  const result = architectSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    return {
      success: false,
      message: 'Erro de validação',
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { id, name, email, phone } = result.data;

  try {
    if (id) {
      // Atualizar
      await prisma.architect.update({
        where: { id: id, userId: session.user.id }, // Segurança
        data: { name, email, phone },
      });
    } else {
      // Criar
      await prisma.architect.create({
        data: {
          name,
          email,
          phone,
          userId: session.user.id,
        },
      });
    }

    revalidatePath('/contacts');
    return { success: true, message: 'Arquiteto salvo com sucesso' };
  } catch (error) {
    return { success: false, message: 'Erro de banco de dados' };
  }
}


