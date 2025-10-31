'use client'; // <-- Adicione esta linha

import { Title, Text, Paper, SimpleGrid } from '@mantine/core';
import { StatCard } from '../_components/StatCard';
import {
  IconAlertTriangle,
  IconChecklist,
  IconCash,
  IconClock,
} from '@tabler/icons-react';

export default function DashboardPage() {
  return (
    <>
      <Title order={1} mb="xl">
        Dashboard
      </Title>

      {/* Seção de KPIs */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} mb="xl">
        <StatCard
          title="Capacidade da Oficina"
          value="80%"
          description="Alerta de capacidade atingido"
          icon={IconAlertTriangle}
          color="var(--mantine-color-orange-6)"
        />
        <StatCard
          title="Projetos Ativos"
          value="4"
          description="2 em produção, 2 na fila"
          icon={IconChecklist}
          color="var(--mantine-color-blue-6)"
        />
        <StatCard
          title="Pagamentos Pendentes"
          value="R$ 4.500"
          description="Total para os próximos 30 dias"
          icon={IconCash}
          color="var(--mantine-color-red-6)"
        />
        <StatCard
          title="Horas Apontadas (Semana)"
          value="32h"
          description="Meta semanal: 40h"
          icon={IconClock}
          color="var(--mantine-color-gray-7)"
        />
      </SimpleGrid>

      {/* Seção do Timeline */}
      <Paper withBorder shadow="sm" p="lg">
        <Title order={3} mb="md">
          Timeline da Oficina
        </Title>
        <Text c="dimmed">
          (Aqui ficará o componente de agendamento visual com os projetos
          alocados nas próximas semanas...)
        </Text>
      </Paper>
    </>
  );
}