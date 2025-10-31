// src/app/auth/register/page.tsx
'use client';

import { TextInput, PasswordInput, Button, Stack, Alert, Anchor } from '@mantine/core';
import { useFormState } from 'react-dom';
import { registerUser } from '../actions';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 1. Defina o tipo do estado inicial (pode importar de 'actions.ts' se preferir)
type RegisterState = {
  success: boolean;
  error?: {
    name?: string[];
    email?: string[];
    password?: string[];
    _form?: string[];
  };
};

// 2. Aplique o tipo ao estado inicial
const initialState: RegisterState = { success: false, error: {} };

export default function RegisterPage() {
  const [state, formAction] = useFormState(registerUser, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      // Redireciona para o login após o sucesso
      router.push('/auth/login?registered=true');
    }
  }, [state.success, router]);

  return (
    <form action={formAction}>
      <Stack>
        {state.error?._form && (
          <Alert color="red" title="Erro no Registro">
            {/* O erro agora é um array, pegue o primeiro item */}
            {state.error._form[0]} 
          </Alert>
        )}

        <TextInput
          label="Nome da Marcenaria"
          name="name"
          placeholder="Minha Marcenaria LTDA"
          required
          // Pegue o primeiro erro do array
          error={state.error?.name?.[0]}
        />
        <TextInput
          label="Email"
          name="email"
          type="email"
          placeholder="seu@email.com"
          required
          error={state.error?.email?.[0]}
        />
        <PasswordInput
          label="Senha"
          name="password"
          placeholder="Sua senha"
          required
          error={state.error?.password?.[0]}
        />
        <Button type="submit" fullWidth>
          Criar Conta
        </Button>
        <Anchor component={Link} href="/auth/login" ta="center">
          Já tem uma conta? Faça login
        </Anchor>
      </Stack>
    </form>
  );
}