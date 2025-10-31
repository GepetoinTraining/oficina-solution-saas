// src/app/(app)/_components/AppShellClient.tsx
'use client';

import { AppShell, AppShellProps } from '@mantine/core';
import { Session } from 'next-auth';
import  AppHeader  from './AppHeader';
import { AppNavbar } from './AppNavbar';

// Definimos as props que o Client Component receberá
interface AppShellClientProps extends Omit<AppShellProps, 'children'> {
  session: Session;
  children: React.ReactNode;
}

export function AppShellClient({
  session,
  children,
  ...props
}: AppShellClientProps) {
  return (
    <AppShell
      {...props} // Passa as props do layout (header, navbar, padding)
    >
      {/* Header */}
      <AppShell.Header>
        <AppHeader session={session} />
      </AppShell.Header>

      {/* Navbar */}
      <AppShell.Navbar p="md">
        <AppNavbar />
      </AppShell.Navbar>

      {/* Conteúdo da Página */}
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}