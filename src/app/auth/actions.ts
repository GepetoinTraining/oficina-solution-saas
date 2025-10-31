// src/app/auth/actions.ts
'use server';

import bcrypt from 'bcryptjs';
import prisma from '@/app/lib/prisma';
import { z } from 'zod';

// 1. Defina um tipo para o estado
type RegisterState = {
  success: boolean;
  error?: {
    name?: string[];
    email?: string[];
    password?: string[];
    _form?: string[]; // Para erros gerais
  };
};

// Esquema de validação com Zod
const registerSchema = z.object({
  name: z.string().min(3, 'O nome da marcenaria é obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

// 2. Adicione 'prevState' como o primeiro argumento
export async function registerUser(
  prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> { // 3. O retorno deve ser do tipo RegisterState
  // 1. Validar os dados
  const result = registerSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    // Note que o retorno agora é o objeto de estado completo
    return { success: false, error: result.error.flatten().fieldErrors };
  }

  const { name, email, password } = result.data;

  try {
    // 2. Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: { _form: ['Email já cadastrado.'] } };
    }

    // 3. Criptografar a senha
    const passwordHash = await bcrypt.hash(password, 10);

    // 4. Criar o usuário
    await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
      },
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: { _form: ['Erro ao criar conta. Tente novamente.'] },
    };
  }
}