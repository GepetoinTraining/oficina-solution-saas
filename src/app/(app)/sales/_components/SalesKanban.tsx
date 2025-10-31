// src/app/(app)/sales/_components/SalesKanban.tsx
'use client';

import { Group, Text, Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { Client, Architect, ProjectStatus } from '@prisma/client';
import { SalesProject } from '../types';
import classes from './SalesKanban.module.css';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { SalesLeadModal } from './SalesLeadModal';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SalesKanbanColumn } from './SalesKanbanColumn';
import { SalesProjectCard } from './SalesProjectCard';
import { updateProjectStatus } from '../actions';

const columns: { id: ProjectStatus; title: string }[] = [
  { id: 'LEAD', title: 'Novo Cliente' },
  { id: 'CONTACTED', title: '1º Contato' },
  { id: 'QUOTED', title: 'Visita Agendada' },
  { id: 'QUOTED', title: 'Orçado' },
  { id: 'NEGOTIAÇÃO', title: 'Negociação' },
];

// Helper para agrupar projetos por status
function groupProjectsByStatus(projects: SalesProject[]) {
  return projects.reduce(
    (acc, project) => {
      const status = project.status;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(project);
      return acc;
    },
    {} as Record<ProjectStatus, SalesProject[]>
  );
}

interface SalesKanbanProps {
  initialProjects: SalesProject[];
  clients: Client[];
  architects: Architect[];
}

export function SalesKanban({
  initialProjects,
  clients,
  architects,
}: SalesKanbanProps) {
  // Estado dos projetos agrupados
  const [projectsByStatus, setProjectsByStatus] = useState(() =>
    groupProjectsByStatus(initialProjects)
  );
  // Estado para o Modal
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  // Estado para o <DragOverlay>
  const [activeProject, setActiveProject] = useState<SalesProject | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px de movimento para iniciar o drag
      },
    })
  );

  function findColumn(id: string | number) {
    // Encontra em qual coluna o 'id' (projeto) está
    return (
      Object.keys(projectsByStatus).find((status) =>
        projectsByStatus[status as ProjectStatus].some((p) => p.id === id)
      ) as ProjectStatus | undefined
    );
  }

  function handleDragStart(event: DragStartEvent) {
    // Pega o projeto dos dados do 'useSortable'
    if (event.active.data.current?.project) {
      setActiveProject(event.active.data.current.project);
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    
    // ID do container (coluna) ou de outro card
    const overColumnId = over.data.current?.sortable?.containerId || overId;
    
    const activeColumn = findColumn(activeId);
    
    // Se 'overId' for um ID de coluna, 'overColumn' será o mesmo
    // Se 'overId' for um card, 'findColumn' achará a coluna dele
    const overColumn = findColumn(overId) || (overColumnId as ProjectStatus);

    if (!activeColumn || !overColumn || activeColumn === overColumn) {
      return;
    }

    // Atualização Otimista do Estado
    setProjectsByStatus((prev) => {
      const activeItems = prev[activeColumn] || [];
      const overItems = prev[overColumn] || [];

      // Encontra o projeto sendo movido
      const activeIndex = activeItems.findIndex((p) => p.id === activeId);
      const [movedProject] = activeItems.splice(activeIndex, 1);

      // Adiciona na nova coluna
      overItems.push(movedProject);

      return {
        ...prev,
        [activeColumn]: [...activeItems],
        [overColumn]: [...overItems],
      };
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveProject(null); // Limpa o overlay

    if (!over) return;
    
    const projectId = active.id as string;
    
    // ID da coluna de destino
    const newColumnId = (over.data.current?.sortable?.containerId || over.id) as ProjectStatus;
    
    const startColumn = findColumn(projectId);

    if (!startColumn) return;

    // Se a coluna não mudou, não faz nada no backend
    if (startColumn !== newColumnId) {
      // Otimismo: já atualizamos o estado no handleDragOver
      
      // Chamada Fire-and-Forget para a Server Action
      updateProjectStatus({ projectId, newStatus: newColumnId }).then(
        (result) => {
          if (!result.success) {
            // TODO: Adicionar notificação de erro (toaster)
            console.error('Falha ao atualizar status:', result.message);
            // Aqui poderíamos reverter o estado, mas por enquanto
            // manteremos a atualização otimista.
          }
        }
      );
    }
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveProject(null)}
    >
      <Group justify="space-between" mb="md">
        <Text>Arraste os cards para mudar o status.</Text>
        <Button leftSection={<IconPlus size={16} />} onClick={openModal}>
          Novo Projeto
        </Button>
      </Group>

      {/* Container do Kanban */}
      <Group
        grow
        align="flex-start"
        wrap="nowrap"
        className={classes.kanbanContainer}
      >
        {columns.map((column) => (
          <SalesKanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            projects={projectsByStatus[column.id] || []}
          />
        ))}
      </Group>

      {/* Overlay: Mostra o card "fantasma" sendo arrastado */}
      <DragOverlay>
        {activeProject ? (
          <SalesProjectCard project={activeProject} className={classes.dragOverlay} />
        ) : null}
      </DragOverlay>

      <SalesLeadModal
        opened={modalOpened}
        onClose={closeModal}
        clients={clients}
        architects={architects}
      />
    </DndContext>
  );
}