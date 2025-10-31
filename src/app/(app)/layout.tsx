// src/app/(app)/layout.tsx

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { AppShell } from '@mantine/core';
import  AppHeader  from './_components/AppHeader'; // Criaremos este
import { AppNavbar } from './_components/AppNavbar'; // Criaremos este

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Obter a sessão no servidor
  const session = await getServerSession(authOptions);

  // 2. Proteger a rota: se não houver sessão, redireciona para o login
  if (!session) {
    // Redireciona para o login, com um callback para voltar ao dashboard
    redirect('/auth/login?callbackUrl=/dashboard');
  }

  // 3. Renderizar o layout principal (shell) do aplicativo
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: 'sm',
        collapsed: { mobile: true }, // Menu colapsado no mobile
      }}
      padding="md"
    >
      {/* Passamos a sessão para o Header poder exibir o nome do usuário */}
      <AppShell.Header>
        <AppHeader session={session} />
      </AppShell.Header>

      {/* O menu lateral */}
      <AppShell.Navbar p="md">
        <AppNavbar />
      </AppShell.Navbar>

      {/* O conteúdo da página (ex: /dashboard) será renderizado aqui */}
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}