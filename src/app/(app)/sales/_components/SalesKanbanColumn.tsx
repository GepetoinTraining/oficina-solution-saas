// src/app/(app)/sales/_components/SalesKanbanColumn.tsx
'use client';

import { Paper, Title, Stack } from '@mantine/core';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import classes from './SalesKanban.module.css';
import { ProjectStatus } from '@prisma/client';
import { SalesProject } from '../types'; // <-- 1. Adicione esta importação
import { SalesProjectCardDraggable } from './SalesProjectCardDraggable'; // <-- 2. Corrija o nome do componente importado

interface SalesKanbanColumnProps {
  id: ProjectStatus;
  title: string;
  projects: SalesProject[]; // <-- Agora este tipo será encontrado
}

export function SalesKanbanColumn({
  id,
  title,
  projects,
}: SalesKanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  const projectIds = projects.map((p) => p.id);

  return (
    <Paper withBorder p="md" className={classes.column}>
      <Title order={4} mb="md" ta="center">
        {title} ({projects.length})
      </Title>

      {/* Este Contexto permite reordenar itens DENTRO da coluna */}
      <SortableContext
        id={id}
        items={projectIds}
        strategy={verticalListSortingStrategy}
      >
        <Stack gap="sm" ref={setNodeRef} className={classes.columnBody}>
          {projects.map((project) => (
            // 3. Esta linha já estava correta, usando o componente certo
            <SalesProjectCardDraggable key={project.id} project={project} />
          ))}
        </Stack>
      </SortableContext>
    </Paper>
  );
}