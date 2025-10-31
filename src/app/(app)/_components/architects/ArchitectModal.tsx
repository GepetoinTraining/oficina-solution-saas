// src/app/(app)/_components/architects/ArchitectModal.tsx
'use client';

import {
  Modal,
  Stack,
  TextInput,
  Button,
  Group,
  Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Architect } from '@prisma/client';
import { upsertArchitect } from '../../contacts/actions';
import { useActionState, useEffect } from 'react'; // 1. Mude o import
import { IconAlertCircle } from '@tabler/icons-react';

interface ArchitectModalProps {
  opened: boolean;
  onClose: () => void;
  architect: Architect | null; // Passa o arquiteto para edição
}

const initialState = { success: false, message: '' };

export function ArchitectModal({
  opened,
  onClose,
  architect,
}: ArchitectModalProps) {
const [state, formAction] = useActionState(upsertArchitect, initialState); // 2. Mude o hook

  const form = useForm({
    initialValues: {
      name: architect?.name || '',
      email: architect?.email || '',
      phone: architect?.phone || '',
    },
  });

  // Atualiza o form se o arquiteto mudar (ex: abrir modal para outro)
  useEffect(() => {
    form.setValues({
      name: architect?.name || '',
      email: architect?.email || '',
      phone: architect?.phone || '',
    });
  }, [architect]);

  // Fecha o modal e reseta o form após o sucesso
  useEffect(() => {
    if (state.success) {
      onClose();
      form.reset();
    }
  }, [state.success, onClose]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={architect ? 'Editar Arquiteto' : 'Novo Arquiteto'}
    >
      <form action={formAction}>
        <Stack>
          {/* Campo oculto para ID (edição) */}
          {architect && <input type="hidden" name="id" value={architect.id} />}

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
            label="Nome"
            name="name"
            placeholder="Nome do Arquiteto"
            required
            {...form.getInputProps('name')}
            error={state.errors?.name}
          />
          <TextInput
            label="Email"
            name="email"
            type="email"
            placeholder="arquiteto@email.com"
            {...form.getInputProps('email')}
            error={state.errors?.email}
          />
          <TextInput
            label="Telefone"
            name="phone"
            placeholder="(11) 99999-9999"
            {...form.getInputProps('phone')}
            error={state.errors?.phone}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}