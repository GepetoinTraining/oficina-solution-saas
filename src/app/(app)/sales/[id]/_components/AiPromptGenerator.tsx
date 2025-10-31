'use client';

import React, { useState } from 'react';
import {
  Button,
  Group,
  Textarea,
  Paper,
  Title,
  Text,
  Stack,
  Code,
  CopyButton,
  ActionIcon,
  Tooltip,
  ScrollArea,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCopy, IconCheck, IconArrowRight } from '@tabler/icons-react';

// Sub-componente para exibir o prompt gerado
function GeneratedPrompt({ promptText }: { promptText: string }) {
  if (!promptText) return null;

  return (
    <Paper
      withBorder
      p="md"
      mt="xl"
      radius="md"
      style={{ background: 'var(--mantine-color-gray-0)' }}
    >
      <Group justify="space-between" mb="xs">
        <Text fw={700} size="sm">
          Prompt Gerado (Pronto para Copiar)
        </Text>
        <CopyButton value={promptText}>
          {({ copied, copy }) => (
            <Tooltip label={copied ? 'Copiado!' : 'Copiar'} withArrow>
              <ActionIcon
                color={copied ? 'teal' : 'gray'}
                onClick={copy}
                variant="subtle"
              >
                {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
      </Group>
      <ScrollArea style={{ height: 250 }}>
        <Code block style={{ whiteSpace: 'pre-wrap' }}>
          {promptText}
        </Code>
      </ScrollArea>
    </Paper>
  );
}

// Constantes de construção
const consts = {
  padroes_de_construcao: `# PADRÕES DE CONSTRUÇÃO (CONST)
Material Padrão: MDF 18mm
Método: Parafusos e cola
Estrutura: Laterais sempre inteiriças (do chão ao topo)
Folga Gaveta: 3mm na largura
Fundo: 6mm, sempre embutido 20mm da borda traseira`,
};

export function AiPromptGenerator() {
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  const form = useForm({
    initialValues: {
      medidas_finais: '',
      mockup_designer: '',
    },
  });

  const handleGeneratePrompt = (values: typeof form.values) => {
    const prompt = `## TAREFA: GERAR LISTA DE PEÇAS (JSON) A PARTIR DO MOCK-UP

## 1. REGRAS OBRIGATÓRIAS (CONSTS):
${consts.padroes_de_construcao}

## 2. MOCK-UP DO DESIGNER (VARS):
* **Medidas Finais:** ${values.medidas_finais}
* **Descrição do Projeto:** ${values.mockup_designer}

## 3. INSTRUÇÕES DE SAÍDA:
1. Calcule as dimensões exatas de CADA peça individual necessária (laterais, divisórias, prateleiras, etc.) seguindo os \`padroes_de_construcao\`.
2. Gere a saída **APENAS** em formato JSON como no exemplo:
   \`{"parts": [{"name": "Lateral_Esquerda", "width": 550, "height": 2490, "quantity": 1, "material": "18mm"}, ...]}\`
`;
    setGeneratedPrompt(prompt.trim());
  };

  return (
    <Stack>
      <form onSubmit={form.onSubmit(handleGeneratePrompt)}>
        <Stack>
          <Textarea
            label="Medidas Finais (Anotações do Papel)"
            placeholder="Ex: 2480mm L x 2590mm A x 550mm P"
            minRows={2}
            autosize
            {...form.getInputProps('medidas_finais')}
          />
          <Textarea
            label="Descrição do Projeto (Mock-up do Papel)"
            placeholder="Ex: Um armário de 4 portas. 3 vãos internos iguais (2 divisórias)..."
            minRows={5}
            autosize
            {...form.getInputProps('mockup_designer')}
          />
          <Button
            type="submit"
            mt="md"
            fullWidth
            color="orange"
            rightSection={<IconArrowRight size={18} />}
          >
            Gerar Prompt para IA
          </Button>
        </Stack>
      </form>

      <GeneratedPrompt promptText={generatedPrompt} />
    </Stack>
  );
}
export default AiPromptGenerator;