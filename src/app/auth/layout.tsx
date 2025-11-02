// src/app/auth/layout.tsx
import { Container, Paper, Title } from '@mantine/core';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container size="xs" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper withBorder shadow="md" p="xl" radius="md" style={{ width: '100%' }}>
        <Title ta="center" order={2} mb="lg">
          Oficina SaaS
        </Title>
          <Suspense fallback={<Loader />}>
            {children}
        </Suspense>
      </Paper>
    </Container>
  );
}