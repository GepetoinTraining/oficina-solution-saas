// src/app/(app)/contacts/_components/ContactsPageClient.tsx
'use client';

import {
  Title,
  Grid,
  Stack,
  Button,
  Group,
  SimpleGrid,
} from '@mantine/core';
import { Client, Architect } from '@prisma/client';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { IconPlus, IconUser, IconBuildingCommunity } from '@tabler/icons-react';
import { ClientModal } from '../_components/clients/ClientModal';
import { ClientCard } from '../_components/clients/ClientCard';
import { ArchitectModal } from '../_components/architects/ArchitectModal';
import { ArchitectCard } from '../_components/architects/ArchitectCard'; // Criaremos este

interface ContactsPageClientProps {
  initialClients: Client[];
  initialArchitects: Architect[];
}

export function ContactsPageClient({
  initialClients,
  initialArchitects,
}: ContactsPageClientProps) {
  // Estado dos Modais
  const [
    clientModalOpened,
    { open: openClientModal, close: closeClientModal },
  ] = useDisclosure(false);
  const [
    architectModalOpened,
    { open: openArchitectModal, close: closeArchitectModal },
  ] = useDisclosure(false);

  // Estado para Edição
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedArchitect, setSelectedArchitect] =
    useState<Architect | null>(null);

  // Handlers
  const handleOpenNewClient = () => {
    setSelectedClient(null);
    openClientModal();
  };

  const handleOpenEditClient = (client: Client) => {
    setSelectedClient(client);
    openClientModal();
  };

  const handleOpenNewArchitect = () => {
    setSelectedArchitect(null);
    openArchitectModal();
  };

  const handleOpenEditArchitect = (architect: Architect) => {
    setSelectedArchitect(architect);
    openArchitectModal();
  };

  return (
    <>
      <Stack>
        {/* --- Clientes --- */}
        <Group justify="space-between" mb="md">
          <Title order={2}>Clientes</Title>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={handleOpenNewClient}
          >
            Novo Cliente
          </Button>
        </Group>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
          {initialClients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onEdit={handleOpenEditClient}
            />
          ))}
        </SimpleGrid>

        {/* --- Arquitetos --- */}
        <Group justify="space-between" mt="xl" mb="md">
          <Title order={2}>Arquitetos</Title>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={handleOpenNewArchitect}
            variant="outline"
          >
            Novo Arquiteto
          </Button>
        </Group>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
          {/* Usaremos um ArchitectCard similar ao ClientCard */}
          {initialArchitects.map((architect) => (
            <ArchitectCard
              key={architect.id}
              architect={architect}
              onEdit={handleOpenEditArchitect}
            />
          ))}
        </SimpleGrid>
      </Stack>

      {/* --- Modais --- */}
      <ClientModal
        opened={clientModalOpened}
        onClose={closeClientModal}
        client={selectedClient}
      />
      <ArchitectModal
        opened={architectModalOpened}
        onClose={closeArchitectModal}
        architect={selectedArchitect}
      />
    </>
  );
}