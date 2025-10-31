// src/app/(app)/sales/[id]/page.tsx
import {
  Container,
  Title,
  Text,
  Group,
  Badge,
  Paper,
  Tabs,
  Stack,
  ActionIcon,
} from '@mantine/core';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/app/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { IconArrowLeft, IconUser, IconBuildingCommunity } from '@tabler/icons-react';
import Link from 'next/link';
import { FirstMeetingForm } from './_components/FirstMeetingForm';

async function getProjectData(projectId: string, userId: string) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      client: {
        userId: userId, // Garante que o projeto é do usuário
      },
    },
    include: {
      client: true,
      architect: true,
    },
  });
  return project;
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/auth/login');
  }

  const project = await getProjectData(params.id, session.user.id);

  if (!project) {
    notFound();
  }

  return (
    <Container size="xl">
      <Stack>
        {/* --- Header --- */}
        <Group>
          <ActionIcon component={Link} href="/sales" variant="default" size="lg">
            <IconArrowLeft size={18} />
          </ActionIcon>
          <Title order={2}>{project.name}</Title>
          <Badge size="lg">{project.status}</Badge>
        </Group>

        {/* --- Info Cards --- */}
        <Group grow>
          <Paper withBorder p="md" radius="md">
            <Group>
              <IconUser />
              <Stack gap={0}>
                <Text size="xs" c="dimmed">Cliente</Text>
                <Text fw={500}>{project.client.name}</Text>
              </Stack>
            </Group>
          </Paper>
          {project.architect && (
             <Paper withBorder p="md" radius="md">
             <Group>
               <IconBuildingCommunity />
               <Stack gap={0}>
                 <Text size="xs" c="dimmed">Arquiteto</Text>
                 <Text fw={500}>{project.architect.name}</Text>
               </Stack>
             </Group>
           </Paper>
          )}
        </Group>

        {/* --- Conteúdo Principal (Formulário, Orçamento, etc) --- */}
        <Paper withBorder p="md" radius="md" mt="md">
          <Tabs defaultValue="meeting">
            <Tabs.List>
              <Tabs.Tab value="meeting">Briefing / 1ª Reunião</Tabs.Tab>
              <Tabs.Tab value="quote">Orçamento</Tabs.Tab>
              <Tabs.Tab value="negotiation">Negociação</Tabs.Tab>
              <Tabs.Tab value="production">Produção</Tabs.Tab>
              <Tabs.Tab value="wallet">Project Wallet</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="meeting" pt="md">
              <FirstMeetingForm project={project} />
            </Tabs.Panel>

            <Tabs.Panel value="quote" pt="md">
              <Text c="dimmed">
                (Em breve: Onde o marceneiro irá construir o orçamento
                item-a-item (Cozinha, Banheiro) usando os novos QuoteItems)
              </Text>
            </Tabs.Panel>
            
            <Tabs.Panel value="negotiation" pt="md">
              <Text c="dimmed">
                (Em breve: A visão do cliente para comentar em cada item)
              </Text>
            </Tabs.Panel>
          </Tabs>
        </Paper>
      </Stack>
    </Container>
  );
}