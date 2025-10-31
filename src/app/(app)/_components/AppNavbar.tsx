// src/app/(app)/_components/AppNavbar.tsx
'use client';

import { NavLink } from '@mantine/core';
import Link from 'next/link';
import {
  IconHome,
  IconChecklist,
  IconUsers,
  IconPackages,
  IconSettings,
  IconCurrencyDollar
} from '@tabler/icons-react';

const navLinks = [
  { icon: IconHome, label: 'Dashboard', href: '/dashboard' },
  { icon: IconCurrencyDollar, label: 'Vendas', href: '/sales' },
  { icon: IconChecklist, label: 'Projetos', href: '/projects' },
  { icon: IconUsers, label: 'Contatos', href: '/contacts' },
  { icon: IconPackages, label: 'Catálogo', href: '/catalog' },
  { icon: IconSettings, label: 'Configurações', href: '/settings/company' },
];

export function AppNavbar() {
  return (
    <div>
      {navLinks.map((link) => (
        <NavLink
          key={link.label}
          label={link.label}
          leftSection={<link.icon size={16} />}
          component={Link}
          href={link.href}
        />
      ))}
    </div>
  );
}