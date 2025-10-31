// src/app/(app)/sales/_components/SalesKanban.tsx
'use client';

import { Paper, Group, Title, Text, Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { Client, Architect } from '@prisma/client';
import { SalesProject } from '../types';
import classes from './SalesKanban.module.css'; // Criaremos este CSS

// Define as colunas do nosso Kanban de Vendas
const columns = [
  { id: 'LEAD', title: 'Lead' },
  { id: 'CONTACTED', title: 'Contactado' },
  { id: 'QUOTED', title: 'Orçado' },
  { id: 'NEGOTIAÇÃO', title: 'Negociação' },
];

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
  // TODO: Adicionar estado para os projetos (para o dnd)
  // const [projects, setProjects] = useState(initialProjects);

  return (
    <div>
      <Group justify="space-between" mb="md">
        <Text>Arraste os cards para mudar o status.</Text>
        <Button leftSection={<IconPlus size={16} />}>Novo Lead</Button>
      </Group>

      {/* Container do Kanban */}
      <Group grow align="flex-start" wrap="nowrap" className={classes.kanbanContainer}>
        {columns.map((column) => (
          <Paper
            key={column.id}
            withBorder
            p="md"
            className={classes.column}
          >
            <Title order={4} mb="md" ta="center">
              {column.title}
            </Title>
            
            {/* TODO: Área para "dropar" os cards */}
            <div className={classes.columnBody}>
                {/* Aqui é onde vamos mapear e renderizar 
                  os cards de projeto para esta coluna 
                */}
                <Text size="sm" c="dimmed" ta="center">
                  Nenhum projeto aqui.
                </Text>
            </div>
          </Paper>
        ))}
      </Group>
    </div>
  );
}