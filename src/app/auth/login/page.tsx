// src/app/auth/login/page.tsx
'use client';

import { TextInput, PasswordInput, Button, Stack, Alert, Anchor } from '@mantine/core';
import { useForm } from '@mantine/form';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const justRegistered = searchParams.get('registered') === 'true';

  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Email inválido'),
      password: (val) => (val.length < 6 ? 'Senha muito curta' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setError(null);

    const result = await signIn('credentials', {
      ...values,
      redirect: false, // Importante: não redireciona, retorna o resultado
    });

    if (result?.error) {
      setError("Email ou senha inválidos.");
    } else {
      // Sucesso, redireciona para o dashboard
      router.push(callbackUrl);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        {justRegistered && (
          <Alert color="green" title="Sucesso!">
            Conta criada! Faça login para continuar.
          </Alert>
        )}
        {error && (
          <Alert color="red" title="Erro no Login">
            {error}
          </Alert>
        )}

        <TextInput
          label="Email"
          type="email"
          placeholder="seu@email.com"
          required
          {...form.getInputProps('email')}
        />
        <PasswordInput
          label="Senha"
          placeholder="Sua senha"
          required
          {...form.getInputProps('password')}
        />
        <Button type="submit" fullWidth>
          Entrar
        </Button>
        <Anchor component={Link} href="/auth/register" ta="center">
          Não tem uma conta? Crie agora
        </Anchor>
      </Stack>
    </form>
  );
}