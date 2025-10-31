// src/app/(app)/_components/architects/ArchitectCard.tsx
'use client';

import { Paper, Title, Text, Group, ActionIcon, Stack } from '@mantine/core';
import { Architect } from '@prisma/client';
import {
  IconPencil,
  IconMail,
  IconPhone,
  IconBuildingCommunity,
} from '@tabler/icons-react';

interface ArchitectCardProps {
  architect: Architect;
  onEdit: (architect: Architect) => void;
}

export function ArchitectCard({ architect, onEdit }: ArchitectCardProps) {
  return (
    <Paper withBorder p="md" radius="md" shadow="sm">
      <Group justify="space-between" align="flex-start">
        <Stack gap="xs">
          <Group>
            <IconBuildingCommunity size={20} />
            <Title order={4}>{architect.name}</Title>
          </Group>
          {architect.email && (
            <Group gap="xs">
              <IconMail size={14} />
              <Text size="sm">{architect.email}</Text>
            </Group>
          )}
          {architect.phone && (
            <Group gap="xs">
              <IconPhone size={14} />
              <Text size="sm">{architect.phone}</Text>
            </Group>
          )}
        </Stack>
        <ActionIcon variant="outline" onClick={() => onEdit(architect)}>
          <IconPencil size={16} />
        </ActionIcon>
      </Group>
    </Paper>
  );
}