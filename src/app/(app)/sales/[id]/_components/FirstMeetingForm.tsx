// src/app/(app)/sales/[id]/_components/FirstMeetingForm.tsx
'use client';

import {
  Textarea,
  SimpleGrid,
  Group,
  Button,
  Stack,
  LoadingOverlay,
  Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Project } from '@prisma/client';
import { IconDeviceFloppy, IconPrinter } from '@tabler/icons-react';
import { useActionState, useEffect, useTransition } from 'react';
import { updateMeetingNotes } from '../actions';
import Link from 'next/link';

// 1. Defina a estrutura do formulário
interface MeetingFormData {
  ambientes: string;
  detalhes: string;
  materiais: string;
  inspiracoes: string;
  prazos: string;
  orcamento: string;
}

// 2. Estado inicial da Server Action
const initialState = { success: false, message: '' };

export function FirstMeetingForm({ project }: { project: Project }) {
  // 3. Hook para pending UI
  const [isPending, startTransition] = useTransition();

  // 4. Server Action state
  const [state, formAction] = useActionState(updateMeetingNotes, initialState);

  // 5. Mantine Form
  const form = useForm<MeetingFormData>({
    initialValues: {
      ambientes: '',
      detalhes: '',
      materiais: '',
      inspiracoes: '',
      prazos: '',
      orcamento: '',
    },
  });

  // 6. Carrega os dados salvos do DB no formulário
  useEffect(() => {
    if (project.meetingNotes) {
      try {
        const data = JSON.parse(project.meetingNotes) as MeetingFormData;
        form.setValues(data);
      } catch (e) {
        // Se não for JSON, trata como texto simples (legado)
        form.setValues({ ...form.values, detalhes: project.meetingNotes });
      }
    }
  }, [project.meetingNotes]);

  // 7. Ação de Submit
  const handleSubmit = (values: MeetingFormData) => {
    const formData = new FormData();
    formData.append('projectId', project.id);
    // Salvamos os valores do form como uma string JSON
    formData.append('meetingNotes', JSON.stringify(values));

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <LoadingOverlay visible={isPending} />

        {state.success && (
          <Alert color="green" title="Sucesso">
            Briefing salvo!
          </Alert>
        )}
        {!state.success && state.message && (
          <Alert color="red" title="Erro">
            {state.message}
          </Alert>
        )}

        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Textarea
            label="Ambientes"
            placeholder="Ex: Cozinha, Home Office"
            rows={4}
            {...form.getInputProps('ambientes')}
          />
          <Textarea
            label="Detalhes / Medidas"
            placeholder="Ex: Cozinha 3.20m x 2.10m. Ponto de gás..."
            rows={4}
            {...form.getInputProps('detalhes')}
          />
          <Textarea
            label="Materiais Desejados"
            placeholder="Ex: MDF Grafite, Puxador Gola"
            rows={4}
            {...form.getInputProps('materiais')}
          />
          <Textarea
            label="Inspirações"
            placeholder="Ex: Links do Pinterest, estilo industrial"
            rows={4}
            {...form.getInputProps('inspiracoes')}
          />
          <Textarea
            label="Prazos"
            placeholder="Ex: Precisa estar pronto até o Natal"
            rows={2}
            {...form.getInputProps('prazos')}
          />
          <Textarea
            label="Orçamento Estimado (pelo cliente)"
            placeholder="Ex: R$ 15.000 - R$ 20.000"
            rows={2}
            {...form.getInputProps('orcamento')}
          />
        </SimpleGrid>
        <Group justify="flex-end" mt="md">
          <Button
            component={Link}
            href={`/sales/${project.id}/print`}
            target="_blank" // Abre em nova aba
            variant="default"
            leftSection={<IconPrinter size={16} />}
          >
            Imprimir
          </Button>
          <Button type="submit" leftSection={<IconDeviceFloppy size={16} />}>
            Salvar Briefing
          </Button>
        </Group>
      </Stack>
    </form>
  );
}