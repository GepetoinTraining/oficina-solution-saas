// src/app/(app)/_components/clients/ClientModal.tsx
'use client';

import {
  Modal,
  Stack,
  TextInput,
  Button,
  Group,
  Alert,
  Tabs,
  SimpleGrid,
  Select,
  Textarea,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Client, ClientIncomeLevel, PriceSensitivity } from '@prisma/client';
import { upsertClient } from '../../contacts/actions';
import { useActionState, useEffect } from 'react'; // 1. Mude o import
import {
  IconAlertCircle,
  IconUser,
  IconMapPin,
  IconBriefcase, // <-- Correção
  IconChartBar,
} from '@tabler/icons-react';

interface ClientModalProps {
  opened: boolean;
  onClose: () => void;
  client: Client | null;
}

const initialState = { success: false, message: '' };

export function ClientModal({ opened, onClose, client }: ClientModalProps) {
  const [state, formAction] = useActionState(upsertClient, initialState); // 2. Mude o hook

  const form = useForm<Partial<Client>>({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      addressStreet: '',
      addressNumber: '',
      addressNeighborhood: '',
      addressCity: '',
      addressState: '',
      addressZipCode: '',
      company: '',
      jobTitle: '',
      linkedinProfile: '',
      instagramProfile: '',
      priceSensitivity: null,
      incomeLevel: null,
      leadSource: '',
      notes: '',
    },
  });

  // Popula o form quando 'client' (para edição) é passado
  useEffect(() => {
    form.setValues({
      name: client?.name || '',
      email: client?.email || '',
      phone: client?.phone || '',
      addressStreet: client?.addressStreet || '',
      addressNumber: client?.addressNumber || '',
      addressNeighborhood: client?.addressNeighborhood || '',
      addressCity: client?.addressCity || '',
      addressState: client?.addressState || '',
      addressZipCode: client?.addressZipCode || '',
      company: client?.company || '',
      jobTitle: client?.jobTitle || '',
      linkedinProfile: client?.linkedinProfile || '',
      instagramProfile: client?.instagramProfile || '',
      priceSensitivity: client?.priceSensitivity || null,
      incomeLevel: client?.incomeLevel || null,
      leadSource: client?.leadSource || '',
      notes: client?.notes || '',
    });
  }, [client, opened]); // 'opened' para resetar ao abrir

  // Fecha o modal e reseta o form após o sucesso
  useEffect(() => {
    if (state.success) {
      onClose();
    }
  }, [state.success, onClose]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={client ? 'Editar Cliente' : 'Novo Cliente'}
      size="lg"
    >
      <form action={formAction}>
        {/* Campo oculto para ID (edição) */}
        {client && <input type="hidden" name="id" value={client.id} />}

        {!state.success && state.message && (
          <Alert color="red" title="Erro" icon={<IconAlertCircle size={16} />}>
            {state.message}
          </Alert>
        )}

        <Tabs defaultValue="contact">
          <Tabs.List>
            <Tabs.Tab value="contact" leftSection={<IconUser size={14} />}>
              Contato
            </Tabs.Tab>
            <Tabs.Tab value="address" leftSection={<IconMapPin size={14} />}>
              Endereço
            </Tabs.Tab>
            <Tabs.Tab value="profile" leftSection={<IconBriefcase size={14} />}>
              Perfil
            </Tabs.Tab>
            <Tabs.Tab value="crm" leftSection={<IconChartBar size={14} />}>
              CRM
            </Tabs.Tab>
          </Tabs.List>

          {/* --- ABA DE CONTATO --- */}
          <Tabs.Panel value="contact" pt="md">
            <Stack>
              <TextInput
                label="Nome"
                name="name"
                placeholder="Nome do Cliente"
                required
                {...form.getInputProps('name')}
                error={state.errors?.name}
              />
              <TextInput
                label="Email"
                name="email"
                type="email"
                placeholder="cliente@email.com"
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
            </Stack>
          </Tabs.Panel>

          {/* --- ABA DE ENDEREÇO --- */}
          <Tabs.Panel value="address" pt="md">
            <Stack>
              <TextInput
                label="Rua / Logradouro"
                name="addressStreet"
                {...form.getInputProps('addressStreet')}
              />
              <SimpleGrid cols={2}>
                <TextInput
                  label="Número"
                  name="addressNumber"
                  {...form.getInputProps('addressNumber')}
                />
                <TextInput
                  label="Bairro"
                  name="addressNeighborhood"
                  {...form.getInputProps('addressNeighborhood')}
                />
              </SimpleGrid>
              <SimpleGrid cols={3}>
                <TextInput
                  label="Cidade"
                  name="addressCity"
                  {...form.getInputProps('addressCity')}
                />
                <TextInput
                  label="Estado (UF)"
                  name="addressState"
                  {...form.getInputProps('addressState')}
                />
                <TextInput
                  label="CEP"
                  name="addressZipCode"
                  {...form.getInputProps('addressZipCode')}
                />
              </SimpleGrid>
            </Stack>
          </Tabs.Panel>

          {/* --- ABA DE PERFIL --- */}
          <Tabs.Panel value="profile" pt="md">
            <Stack>
              <TextInput
                label="Empresa (Onde trabalha)"
                name="company"
                {...form.getInputProps('company')}
              />
              <TextInput
                label="Cargo"
                name="jobTitle"
                {...form.getInputProps('jobTitle')}
              />
              <TextInput
                label="Perfil do Instagram"
                name="instagramProfile"
                placeholder="https://instagram.com/..."
                {...form.getInputProps('instagramProfile')}
                error={state.errors?.instagramProfile}
              />
              <TextInput
                label="Perfil do LinkedIn"
                name="linkedinProfile"
                placeholder="https://linkedin.com/in/..."
                {...form.getInputProps('linkedinProfile')}
                error={state.errors?.linkedinProfile}
              />
            </Stack>
          </Tabs.Panel>

          {/* --- ABA DE CRM --- */}
          <Tabs.Panel value="crm" pt="md">
            <Stack>
              <Select
                label="Sensibilidade ao Preço"
                name="priceSensitivity"
                placeholder="Selecionar..."
                data={[
                  { value: PriceSensitivity.LOW, label: 'Baixa (Foco em Qualidade)' },
                  { value: PriceSensitivity.MEDIUM, label: 'Média (Equilíbrio)' },
                  { value: PriceSensitivity.HIGH, label: 'Alta (Foco em Preço)' },
                ]}
                {...form.getInputProps('priceSensitivity')}
                clearable
              />
              <Select
                label="Nível de Renda (Estimado)"
                name="incomeLevel"
                placeholder="Selecionar..."
                data={[
                  { value: ClientIncomeLevel.LEVEL_1, label: '< R$ 5k' },
                  { value: ClientIncomeLevel.LEVEL_2, label: 'R$ 5k - R$ 10k' },
                  { value: ClientIncomeLevel.LEVEL_3, label: 'R$ 10k - R$ 20k' },
                  { value: ClientIncomeLevel.LEVEL_4, label: 'R$ 20k - R$ 50k' },
                  { value: ClientIncomeLevel.LEVEL_5, label: '> R$ 50k' },
                ]}
                {...form.getInputProps('incomeLevel')}
                clearable
              />
              <TextInput
                label="Origem do Lead"
                name="leadSource"
                placeholder="Indicação, Instagram, Google..."
                {...form.getInputProps('leadSource')}
              />
              <Textarea
                label="Anotações Gerais"
                name="notes"
                placeholder="Preferências, histórico de conversas, etc..."
                rows={4}
                {...form.getInputProps('notes')}
              />
            </Stack>
          </Tabs.Panel>
        </Tabs>

        {/* --- Botões de Ação --- */}
        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">Salvar Cliente</Button>
        </Group>
      </form>
    </Modal>
  );
}