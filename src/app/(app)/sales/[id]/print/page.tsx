// src/app/(app)/sales/[id]/print/page.tsx
'use client'; // QR Code precisa ser client-side

import {
  Container,
  Title,
  Text,
  Paper,
  Stack,
  SimpleGrid,
  Box,
  Group,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { usePathname } from 'next/navigation';

// Este é um Client Component que busca os dados
// NOTA: Em um app real, poderíamos passar os dados da página do servidor
// mas para impressão, é mais simples fazer assim.
// Ou, idealmente, esta seria uma Server Page que passa os dados para um
// Client Component de QR Code. Vamos simplificar por enquanto.

// Mock data structure - o ideal seria fetchear isso
const mockProject = {
  name: 'Cozinha Apartamento 101',
  client: 'Ana Silva',
};

const mockFormData = {
  ambientes: 'Cozinha, Home Office',
  detalhes: 'Cozinha 3.20m x 2.10m. Ponto de gás...',
  materiais: 'MDF Grafite, Puxador Gola',
  inspiracoes: 'Links do Pinterest, estilo industrial',
  prazos: 'Precisa estar pronto até o Natal',
  orcamento: 'R$ 15.000 - R$ 20.000',
};

// Helper para renderizar os campos do formulário
const FormField = ({ label, value }: { label: string; value: string }) => (
  <Paper withBorder p="md" radius="sm">
    <Text size="sm" c="dimmed" mb={4}>{label}</Text>
    <Text>{value || '____________________'}</Text>
    <Box style={{ minHeight: '60px' }} /> 
  </Paper>
);

export default function PrintMeetingForm() {
  const [url, setUrl] = useState('');
  const pathname = usePathname(); // Ex: /sales/PROJECT_ID/print

  useEffect(() => {
    // Constrói a URL de "edição" (removendo /print)
    const editUrl = window.location.origin + pathname.replace('/print', '');
    setUrl(editUrl);
  }, [pathname]);

  // Aplica estilos de impressão
  useEffect(() => {
    document.body.style.backgroundColor = '#fff';
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .no-print {
          display: none !important;
        }
        .print-page {
          margin: 0;
          padding: 0;
          width: 100%;
          border: none;
          box-shadow: none;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
      document.body.style.backgroundColor = ''; // Reset
    };
  }, []);

  return (
    <Container size="a4" p="xl" className="print-page">
      <Stack>
        {/* --- Header --- */}
        <Group justify="space-between">
          <Box>
            <Title order={2}>Briefing - {mockProject.name}</Title>
            <Text>Cliente: {mockProject.client}</Text>
          </Box>
          <Box ta="center" className="no-print">
            {url && <QRCodeSVG value={url} size={80} />}
            <Text size="xs" c="dimmed">Escanear para editar</Text>
          </Box>
        </Group>

        {/* --- Formulário --- */}
        <SimpleGrid cols={2} mt="xl">
          <FormField label="Ambientes" value={mockFormData.ambientes} />
          <FormField label="Detalhes / Medidas" value={mockFormData.detalhes} />
          <FormField label="Materiais Desejados" value={mockFormData.materiais} />
          <FormField label="Inspirações" value={mockFormData.inspiracoes} />
          <FormField label="Prazos" value={mockFormData.prazos} />
          <FormField label="Orçamento (Cliente)" value={mockFormData.orcamento} />
        </SimpleGrid>

        {/* --- Bloco de Anotações Livres --- */}
        <Paper withBorder p="md" radius="sm" mt="md">
          <Text size="sm" c="dimmed" mb={4}>Anotações / Esboço</Text>
          <Box style={{ minHeight: '300px' }} />
        </Paper>
         
        {/* QR Code de rodapé para a versão impressa */}
         <Group justify="center" visibleFrom="print" mt="lg">
           {url && <QRCodeSVG value={url} size={100} />}
         </Group>

      </Stack>
    </Container>
  );
}