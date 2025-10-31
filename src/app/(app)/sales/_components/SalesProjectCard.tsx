// src/app/(app)/sales/_components/SalesProjectCard.tsx
'use client';

import {
  Paper,
  Title,
  Text,
  Group,
  ActionIcon,
  Stack,
  Anchor,
  PaperProps,
} from '@mantine/core';
import {
  IconPencil,
  IconUser,
  IconCash,
} from '@tabler/icons-react';
import Link from 'next/link';
import { SalesProject } from '../types';
import { ArchitectPill } from '../../_components/architects/ArchitectPill';
import { forwardRef } from 'react';

interface SalesProjectCardProps extends PaperProps {
  project: SalesProject;
}

const formatCurrency = (value: number | null | undefined) => {
  if (value === null || value === undefined) {
    return 'Aguardando Orçamento';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value));
};

export const SalesProjectCard = forwardRef<
  HTMLDivElement,
  SalesProjectCardProps
>(({ project, ...props }, ref) => {
  return (
    <Paper
      withBorder
      p="md"
      radius="md"
      shadow="sm"
      mb="sm"
      ref={ref}
      {...props}
    >
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <Stack gap="xs">
          {/* --- CORREÇÃO AQUI --- */}
          <Anchor
            component={Link}
            href={`/sales/${project.id}`} // <-- Alterado de '#' para o link dinâmico
            fz="lg"
            fw={500}
            draggable={false}
          >
            {project.name}
          </Anchor>

          {/* Cliente */}
          <Group gap="xs">
            <IconUser size={14} color="gray" />
            <Text size="sm">{project.client.name}</Text>
          </Group>

          {/* Arquiteto */}
          <ArchitectPill architect={project.architect} />

          {/* Valor */}
          <Group gap="xs" mt="xs">
            <IconCash size={14} color="gray" />
            <Text
              size={project.totalQuotedPrice ? 'sm' : 'xs'}
              c={project.totalQuotedPrice ? 'default' : 'dimmed'}
            >
              {formatCurrency(project.totalQuotedPrice)}
            </Text>
          </Group>
        </Stack>
        <ActionIcon
          variant="outline"
          // onClick={() => onEdit(project)} // TODO: Implementar
        >
          <IconPencil size={16} />
        </ActionIcon>
      </Group>
    </Paper>
  );
});

SalesProjectCard.displayName = 'SalesProjectCard';