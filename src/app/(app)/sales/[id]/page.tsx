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
import { authOptions } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { IconArrowLeft, IconUser, IconBuildingCommunity } from '@tabler/icons-react';
import { FirstMeetingForm } from './_components/FirstMeetingForm';
import { AiPromptGenerator } from './_components/AiPromptGenerator';

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

// --- CORREÇÃO AQUI ---
// A prop `params` agora é tipada como uma Promise que resolve para o objeto { id: string }
export default async function ProjectDetailPage({
  params: paramsPromise, // 1. Renomeamos a prop para indicar que é uma promise
}: {
  params: Promise<{ id: string }>; // 2. Corrigimos o tipo
}) {
  const params = await paramsPromise; // 3. Await para resolver a promise
  
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/auth/login');
  }

  // 4. Usamos o `params.id` resolvido
  const project = await getProjectData(params.id, session.user.id);

  if (!project) {
    notFound();
  }

  return (
    <Container size="xl">
      <Stack>
        {/* --- Header --- */}
        <Group>
          <ActionIcon component="a" href="/sales" variant="default" size="lg">
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
              <Tabs.Tab value="ai_prompt">Gerador de Prompt (IA)</Tabs.Tab>
              <Tabs.Tab value="quote">Orçamento (Itens)</Tabs.Tab>
              <Tabs.Tab value="negotiation">Negociação</Tabs.Tab>
              <Tabs.Tab value="production">Produção</Tabs.Tab>
              <Tabs.Tab value="wallet">Project Wallet</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="meeting" pt="md">
              <FirstMeetingForm project={project} />
            </Tabs.Panel>
            
            <Tabs.Panel value="ai_prompt" pt="md">
              <Title order={4}>Gerador de Prompt (Papel para JSON)</Title>
              <Text c="dimmed" size="sm" mb="md">
                Use esta ferramenta se você fez anotações em papel. Descreva as
                medidas e o mock-up para gerar um prompt. Copie o prompt e
                cole em uma IA para gerar a lista de peças JSON.
              </Text>
              <AiPromptGenerator />
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