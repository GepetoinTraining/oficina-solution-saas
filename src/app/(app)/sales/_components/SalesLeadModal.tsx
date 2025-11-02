// src/app/(app)/sales/_components/SalesLeadModal.tsx
'use client';

import {
  Modal,
  Stack,
  TextInput,
  Button,
  Group,
  Alert,
  Select,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Architect, Client } from '@prisma/client';
import { createLeadProject } from '../actions';
import { useActionState, useEffect } from 'react';
import { IconAlertCircle } from '@tabler/icons-react';

interface SalesLeadModalProps {
  opened: boolean;
  onClose: () => void;
  clients: Client[]; // Precisamos dos clientes para o <Select>
  architects: Architect[]; // E dos arquitetos
}

const initialState = { 
  success: false, 
  message: '',
  errors: {}
 };

export function SalesLeadModal({
  opened,
  onClose,
  clients,
  architects,
}: SalesLeadModalProps) {
  const [state, formAction] = useActionState(createLeadProject, initialState);

  const form = useForm({
    initialValues: {
      name: '',
      clientId: '',
      architectId: '',
    },
  });

  // Transforma os dados para o formato do Mantine Select
  const clientOptions = clients.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const architectOptions = architects.map((a) => ({
    value: a.id,
    label: a.name,
  }));

  // Fecha o modal e reseta o form após o sucesso
  useEffect(() => {
    if (state.success) {
      onClose();
      form.reset();
    }
  }, [state.success, onClose]);

  // Reseta o form ao fechar (caso não tenha submetido)
  useEffect(() => {
    if (!opened) {
      form.reset();
    }
  }, [opened]);

  return (
    <Modal opened={opened} onClose={onClose} title="Novo Lead">
      <form action={formAction}>
        <Stack>
          {!state.success && state.message && (
            <Alert
              color="red"
              title="Erro"
              icon={<IconAlertCircle size={16} />}
            >
              {state.message}
            </Alert>
          )}

          <TextInput
            label="Nome do Projeto"
            name="name"
            placeholder="Ex: Cozinha Apartamento 101"
            required
            {...form.getInputProps('name')}
            error={state.errors?.name}
          />
          <Select
            label="Cliente"
            name="clientId"
            placeholder="Selecione um cliente"
            data={clientOptions}
            required
            searchable
            {...form.getInputProps('clientId')}
            error={state.errors?.clientId}
          />
          <Select
            label="Arquiteto (Opcional)"
            name="architectId"
            placeholder="Selecione um arquiteto"
            data={architectOptions}
            searchable
            clearable
            {...form.getInputProps('architectId')}
            error={state.errors?.architectId}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar Lead</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}