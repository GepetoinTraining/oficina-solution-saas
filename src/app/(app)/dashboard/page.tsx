// src/app/(app)/dashboard/page.tsx
import { Title, Text, Paper } from '@mantine/core';

export default function DashboardPage() {
  return (
    <>
      <Title order={1} mb="md">
        Dashboard
      </Title>
      <Text mb="lg">
        Bem-vindo à sua central de controle.
      </Text>

      <Paper withBorder shadow="sm" p="lg">
        <Title order={3}>Visão Geral</Title>
        <Text>
          Aqui você verá o timeline da oficina, alertas de capacidade (80%),
          pagamentos pendentes e outros KPIs.
        </Text>
      </Paper>
    </>
  );
}