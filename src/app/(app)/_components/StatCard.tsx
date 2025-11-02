'use client';

import { Paper, Text, Title, Group } from '@mantine/core';
// 1. Import 'IconProps' instead of 'TablerIconsProps'
// import type { IconProps } from '@tabler/icons-react';
import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  // 2. Change 'JSX.Element' to 'React.JSX.Element'
  icon: React.ComponentType<IconProps>;
  color: string;
}

export function StatCard({ title, value, description, icon: Icon, color }: StatCardProps) {
  return (
    <Paper withBorder p="md" radius="md">
      <Group justify="space-between">
        <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
          {title}
        </Text>
        <Icon size={24} color={color} stroke={1.5} />
      </Group>

      <Group align="flex-end" gap="xs" mt="md">
        <Title order={2}>{value}</Title>
      </Group>

      <Text fz="xs" c="dimmed" mt="sm">
        {description}
      </Text>
    </Paper>
  );
}