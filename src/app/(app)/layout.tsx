// src/app/(app)/layout.tsx

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import { AppShellClient } from './_components/AppShellClient'; // 1. Importe o novo client component

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Obter a sessão no servidor
  const session = await getServerSession(authOptions);

  // 2. Proteger a rota: se não houver sessão, redireciona para o login
  if (!session) {
    redirect('/auth/login?callbackUrl=/dashboard');
  }

  // 3. Renderizar o Client Component com o shell, passando a sessão
  return (
    <AppShellClient
      session={session} // Passa a sessão
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: 'sm',
        collapsed: { mobile: true },
      }}
      padding="md"
    >
      {children} {/* Passa o conteúdo da página */}
    </AppShellClient>
  );
}