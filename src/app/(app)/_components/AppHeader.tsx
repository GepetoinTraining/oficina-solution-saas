// src/app/(app)/_components/AppHeader.tsx
'use client';

import { Group, Title, Button, Menu, ActionIcon, Avatar } from '@mantine/core';
import { Session } from 'next-auth'; // Import Session from 'next-auth'
import { signOut } from 'next-auth/react'; // Keep signOut from 'next-auth/react'
import { IconLogout, IconSettings, IconUserCircle } from '@tabler/icons-react';
import Link from 'next/link';

// Recebe a sessão que pegamos no layout (Server Component)
export function AppHeader({ session }: { session: Session }) {

  const userName = session.user?.name || session.user?.email;

  return (
    <Group h="100%" px="md" justify="space-between">
      {/* TODO: Adicionar o "Burger" (menu hamburger) para mobile */}
      <Title order={3}>Oficina SaaS</Title>

      <Group>
        {/* Ícones de Ação (Ideia do Sitemap) */}
        <ActionIcon component={Link} href="/settings/company" variant="default" size="lg">
          <IconSettings size={18} />
        </ActionIcon>

        {/* Menu do Usuário */}
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Button variant="outline" leftSection={<Avatar size="sm" src={session.user?.image}><IconUserCircle size={18} /></Avatar>}>
              {userName}
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Minha Conta</Menu.Label>
            <Menu.Item component={Link} href="/settings/profile" leftSection={<IconUserCircle size={14} />}>
              Perfil
            </Menu.Item>
            <Menu.Item
              color="red"
              leftSection={<IconLogout size={14} />}
              onClick={() => signOut({ callbackUrl: '/' })} // Logout redireciona para a home
            >
              Sair
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
}