// src/app/auth/register/page.tsx
'use client';

import { TextInput, PasswordInput, Button, Stack, Alert, Anchor } from '@mantine/core';
import { useActionState, useEffect } from 'react';
// 1. Import both the function AND the type from actions.ts
import { registerUser, RegisterState } from '../actions';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// 2. Remove the local type definition, as we are now importing it.

// 3. Apply the imported type to the initial state
const initialState: RegisterState = { success: false, error: {} };

export default function RegisterPage() {
  const [state, formAction] = useActionState(registerUser, initialState);
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
            {state.error._form[0]}
          </Alert>
        )}

        <TextInput
          label="Nome da Marcenaria"
          name="name"
          placeholder="Minha Marcenaria LTDA"
          required
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