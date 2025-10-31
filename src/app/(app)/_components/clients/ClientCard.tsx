// src/app/(app)/_components/clients/ClientCard.tsx
'use client';

import {
  Paper,
  Title,
  Text,
  Group,
  ActionIcon,
  Stack,
  Badge,
} from '@mantine/core';
import { Client, PriceSensitivity } from '@prisma/client';
import {
  IconPencil,
  IconMail,
  IconPhone,
  IconMapPin,
} from '@tabler/icons-react';

interface ClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
}

// Helper para o badge de sensibilidade
const getPriceSensitivityProps = (sensitivity: PriceSensitivity | null) => {
  switch (sensitivity) {
    case 'LOW':
      return { label: 'Qualidade', color: 'green' };
    case 'MEDIUM':
      return { label: 'Equilíbrio', color: 'blue' };
    case 'HIGH':
      return { label: 'Preço', color: 'orange' };
    default:
      return null;
  }
};

export function ClientCard({ client, onEdit }: ClientCardProps) {
  const sensitivityProps = getPriceSensitivityProps(client.priceSensitivity);

  return (
    <Paper withBorder p="md" radius="md" shadow="sm">
      <Group justify="space-between" align="flex-start">
        <Stack gap="xs">
          <Title order={4}>{client.name}</Title>

          {/* Infos de Contato */}
          {client.email && (
            <Group gap="xs">
              <IconMail size={14} color="gray" />
              <Text size="sm">{client.email}</Text>
            </Group>
          )}
          {client.phone && (
            <Group gap="xs">
              <IconPhone size={14} color="gray" />
              <Text size="sm">{client.phone}</Text>
            </Group>
          )}

          {/* Info de Endereço */}
          {client.addressCity && (
            <Group gap="xs">
              <IconMapPin size={14} color="gray" />
              <Text size="sm">{client.addressCity}</Text>
            </Group>
          )}

          {/* Info de CRM */}
          {sensitivityProps && (
            <Badge
              variant="light"
              color={sensitivityProps.color}
              size="sm"
              mt="xs"
            >
              Foco: {sensitivityProps.label}
            </Badge>
          )}
        </Stack>
        <ActionIcon variant="outline" onClick={() => onEdit(client)}>
          <IconPencil size={16} />
        </ActionIcon>
      </Group>
    </Paper>
  );
}