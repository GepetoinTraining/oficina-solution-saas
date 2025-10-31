'use client';

import { Container, Title, Text, Stack } from '@mantine/core';
import { PublicHeader } from '../_components/PublicHeader';

export default function AboutPage() {
  return (
    <Stack gap={0}>
      <PublicHeader />
      <Container size="md" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
        <Stack gap="lg">
          <Title
            order={1}
            ta="center"
            style={{ fontSize: '3rem', lineHeight: 1.1 }}
          >
            Sobre a OficinaSaaS
          </Title>
          <Text size="lg" c="dimmed" ta="center" maw={700} mx="auto">
            Nossa missão é digitalizar e otimizar a gestão de marcenarias no
            Brasil, da captação do cliente até a entrega final. Acreditamos que
            a tecnologia certa pode transformar a lucratividade e a organização
            de oficinas de qualquer tamanho.
          </Text>
          <Text ta="center" mt="lg">
            O OficinaSaaS foi criado por especialistas em software e em
            processos de marcenaria, unindo o melhor dos dois mundos para
            resolver dores reais do dia a dia.
          </Text>
        </Stack>
      </Container>
    </Stack>
  );
}