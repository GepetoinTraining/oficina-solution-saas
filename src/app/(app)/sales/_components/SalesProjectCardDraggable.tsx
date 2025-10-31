// src/app/(app)/sales/_components/SalesProjectCardDraggable.tsx
'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SalesProjectCard } from './SalesProjectCard';
import { SalesProject } from '../types';
import classes from './SalesKanban.module.css';

interface SalesProjectCardDraggableProps {
  project: SalesProject;
}

export function SalesProjectCardDraggable({
  project,
}: SalesProjectCardDraggableProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: project.id,
    data: {
      project: project,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Combina a classe base .draggableCard com a classe .dragging condicional
  const cardClassName = `${classes.draggableCard} ${
    isDragging ? classes.dragging : ''
  }`;

  return (
    <SalesProjectCard
      ref={setNodeRef}
      style={style}
      project={project}
      className={cardClassName} // Aplica as classes combinadas
      {...attributes}
      {...listeners}
    />
  );
}