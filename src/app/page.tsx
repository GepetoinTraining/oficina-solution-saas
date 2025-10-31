'use client';

import { Container, Title, Text, Button, Stack, Group } from '@mantine/core';
import { PublicHeader } from './_components/PublicHeader';
import Link from 'next/link';
import { IconArrowRight } from '@tabler/icons-react';

export default function Home() {
  return (
    <Stack gap={0}>
      <PublicHeader />
      <Container size="md" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <Stack gap="xl" align="center">
          <Title
            order={1}
            ta="center"
            style={{ fontSize: '3.5rem', lineHeight: 1.1 }}
          >
            Do Orçamento à Entrega:
            <br />
            O Sistema Completo para sua Marcenaria
          </Title>

          <Text size="xl" c="dimmed" ta="center" maw={600}>
            Organize seus projetos, controle o financeiro de cada obra e gerencie
            sua produção em um só lugar. Feito para marceneiros que valorizam
            tempo e lucro.
          </Text>

          <Group>
            <Button
              component={Link}
              href="/auth/register"
              size="lg"
              rightSection={<IconArrowRight size={16} />}
            >
              Começar Teste Gratuito
            </Button>
            <Button
              component={Link}
              href="/pricing"
              size="lg"
              variant="default"
            >
              Ver Planos
            </Button>
          </Group>
        </Stack>
      </Container>
      
      {/* Aqui podemos adicionar seções de Features, Preços, etc. */}
      
    </Stack>
  );
}