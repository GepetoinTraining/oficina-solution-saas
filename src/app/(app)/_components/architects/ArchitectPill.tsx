// src/app/(app)/_components/architects/ArchitectPill.tsx
'use client';

import { Badge } from '@mantine/core';
import { IconBuildingCommunity } from '@tabler/icons-react';
import { Architect } from '@prisma/client';

interface ArchitectPillProps {
  architect: Architect | null;
}

export function ArchitectPill({ architect }: ArchitectPillProps) {
  if (!architect) {
    return null;
  }

  return (
    <Badge
      variant="outline"
      size="sm"
      leftSection={<IconBuildingCommunity size={12} />}
    >
      {architect.name}
    </Badge>
  );
}