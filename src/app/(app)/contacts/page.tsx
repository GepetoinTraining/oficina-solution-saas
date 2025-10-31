// src/app/(app)/contacts/page.tsx
import { Title } from '@mantine/core';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/app/lib/prisma';
import { redirect } from 'next/navigation';
import { ContactsPageClient } from '../_components/ContactsPageClient';

// Buscamos os dados no Servidor
async function getContactsData(userId: string) {
  const clients = await prisma.client.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
  });
  
  const architects = await prisma.architect.findMany({
    where: { userId },
    orderBy: { name: 'asc' },
  });
  
  return { clients, architects };
}

export default async function ContactsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/auth/login');
  }

  // Passa os dados iniciais para o Client Component
  const { clients, architects } = await getContactsData(session.user.id);

  return (
    <>
      <ContactsPageClient
        initialClients={clients}
        initialArchitects={architects}
      />
    </>
  );
}