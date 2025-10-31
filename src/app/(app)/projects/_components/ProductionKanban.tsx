// src/app/(app)/projects/_components/ProductionKanban.tsx
'use client';

import { Paper, Text } from '@mantine/core';
import { ProductionProject } from '../types';

interface ProductionKanbanProps {
  initialProjects: ProductionProject[];
}

export function ProductionKanban({ initialProjects }: ProductionKanbanProps) {
  return (
    <Paper withBorder p="xl" style={{ minHeight: 400 }}>
      <Text c="dimmed" ta="center">
        (Em Breve: O Kanban do Pipeline de Produção aparecerá aqui)
      </Text>
      <Text ta="center" fw={500} mt="md">
        {initialProjects.length} projeto(s) em produção.
      </Text>
    </Paper>
  );
}