'use client';

import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Paper,
  Button,
  Stack,
  List,
  ThemeIcon,
} from '@mantine/core';
import { PublicHeader } from '../_components/PublicHeader';
import { IconCheck, IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <Stack gap={0}>
      <PublicHeader />
      <Container size="md" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
        <Stack gap="xl" align="center">
          <Title
            order={1}
            ta="center"
            style={{ fontSize: '3rem', lineHeight: 1.1 }}
          >
            Um plano para cada tamanho de marcenaria
          </Title>
          <Text size="lg" c="dimmed" ta="center" maw={600}>
            Comece simples com a gestão de vendas ou adote o sistema completo de
            produção e financeiro.
          </Text>

          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl" mt="xl">
            {/* Plano 1: Vendas */}
            <Paper withBorder radius="md" p="xl">
              <Stack>
                <Title order={3}>Vendas</Title>
                <Text size="sm">Ideal para focar na captação e orçamentos.</Text>
                <Title order={2}>R$ 49/mês</Title>
                <Button component={Link} href="/auth/register" variant="outline">
                  Começar
                </Button>
                <List
                  spacing="sm"
                  size="sm"
                  center
                  icon={
                    <ThemeIcon color="teal" size={20} radius="xl">
                      <IconCheck size={12} stroke={3} />
                    </ThemeIcon>
                  }
                >
                  <List.Item>Pipeline de Vendas (Kanban)</List.Item>
                  <List.Item>Gestão de Clientes</List.Item>
                  <List.Item>Gerador de Orçamentos</List.Item>
                </List>
              </Stack>
            </Paper>

            {/* Plano 2: Vendas + Produção */}
            <Paper withBorder radius="md" p="xl" style={{ borderColor: 'var(--mantine-color-blue-6)' }}>
              <Stack>
                <Title order={3}>Produção</Title>
                <Text size="sm">Para organizar a oficina e o financeiro.</Text>
                <Title order={2}>R$ 99/mês</Title>
                <Button component={Link} href="/auth/register">
                  Começar Teste Gratuito
                </Button>
                <List
                  spacing="sm"
                  size="sm"
                  center
                  icon={
                    <ThemeIcon color="teal" size={20} radius="xl">
                      <IconCheck size={12} stroke={3} />
                    </ThemeIcon>
                  }
                >
                  <List.Item>Tudo do plano Vendas</List.Item>
                  <List.Item>Pipeline de Produção</List.Item>
                  <List.Item>Project Wallet (Financeiro)</List.Item>
                  <List.Item>Agendador de Oficina</List.Item>
                </List>
              </Stack>
            </Paper>

            {/* Plano 3: Completo */}
            <Paper withBorder radius="md" p="xl">
              <Stack>
                <Title order={3}>Completo</Title>
                <Text size="sm">A solução ponta-a-ponta com add-ons.</Text>
                <Title order={2}>R$ 149/mês</Title>
                <Button component={Link} href="/auth/register" variant="outline">
                  Começar
                </Button>
                <List
                  spacing="sm"
                  size="sm"
                  center
                  icon={
                    <ThemeIcon color="teal" size={20} radius="xl">
                      <IconCheck size={12} stroke={3} />
                    </ThemeIcon>
                  }
                >
                  <List.Item>Tudo do plano Produção</List.Item>
                  <List.Item>Gestão de Catálogo e Estoque</List.Item>
                  <List.Item>Módulo Marketplace</List.Item>
                </List>
              </Stack>
            </Paper>
          </SimpleGrid>
        </Stack>
      </Container>
    </Stack>
  );
}