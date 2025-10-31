'use client';

import { Container, Group, Button, Title, Anchor } from '@mantine/core';
import Link from 'next/link';

export function PublicHeader() {
  return (
    <Container size="md" style={{ borderBottom: '1px solid var(--mantine-color-gray-2)', paddingBlock: '1rem' }}>
      <Group justify="space-between">
        <Title order={3}>
          <Anchor component={Link} href="/" underline="never">
            OficinaSaaS
          </Anchor>
        </Title>
        <Group>
          <Button component={Link} href="/auth/login" variant="default">
            Entrar
          </Button>
          <Button component={Link} href="/auth/register">
            Começar Agora
          </Button>
        </Group>
      </Group>
    </Container>
  );
}