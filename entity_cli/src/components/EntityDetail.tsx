// ---
// entity_id: component-entity-detail
// entity_name: Entity Detail Component
// entity_type_id: class
// entity_path: entity_cli/src/components/EntityDetail.tsx
// entity_language: typescript
// entity_state: active
// entity_created: 2026-01-22T16:00:00Z
// entity_exports: [EntityDetail]
// entity_dependencies: [useNeonQuery]
// ---

/**
 * Entity Detail Component
 *
 * Displays full entity information:
 * - Core metadata
 * - Extended fields
 * - Hierarchy (parent/children)
 * - Related entities
 */

import React from 'react';
import { Box, Text, useInput } from 'ink';
import { useNeonQuery } from '../hooks/useNeonQuery.js';

interface EntityDetailProps {
  entityId: string;
  onBack: () => void;
}

interface Entity {
  entity_id: string;
  entity_name: string;
  entity_type_id: string;
  entity_path: string;
  entity_line_start: number;
  entity_line_end: number | null;
  entity_language: string;
  entity_state: string;
  entity_docstring: string | null;
  entity_signature: string | null;
  entity_parent_id: string | null;
}

/**
 * Entity detail view component.
 */
export function EntityDetail({
  entityId,
  onBack,
}: EntityDetailProps): React.ReactElement {
  const { data: entity, loading, error } = useNeonQuery<Entity>(
    `SELECT * FROM entities WHERE entity_id = $1`,
    [entityId]
  );

  useInput((input, key) => {
    if (key.escape || input === 'b') {
      onBack();
    }
  });

  if (loading) {
    return (
      <Box>
        <Text>Loading entity...</Text>
      </Box>
    );
  }

  if (error || !entity) {
    return (
      <Box>
        <Text color="red">Error: {error || 'Entity not found'}</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" borderStyle="single" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          {entity.entity_name}
        </Text>
        <Text dimColor> ({entity.entity_type_id})</Text>
      </Box>

      <DetailRow label="ID" value={entity.entity_id} />
      <DetailRow label="Path" value={entity.entity_path} />
      <DetailRow
        label="Lines"
        value={`${entity.entity_line_start}${entity.entity_line_end ? `-${entity.entity_line_end}` : ''}`}
      />
      <DetailRow label="Language" value={entity.entity_language} />
      <DetailRow label="State" value={entity.entity_state} />

      {entity.entity_signature && (
        <Box marginTop={1}>
          <Text dimColor>Signature: </Text>
          <Text color="yellow">{entity.entity_signature}</Text>
        </Box>
      )}

      {entity.entity_docstring && (
        <Box marginTop={1} flexDirection="column">
          <Text dimColor>Docstring:</Text>
          <Text>{entity.entity_docstring}</Text>
        </Box>
      )}

      <Box marginTop={1}>
        <Text dimColor>Press 'b' or ESC to go back</Text>
      </Box>
    </Box>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
}

function DetailRow({ label, value }: DetailRowProps): React.ReactElement {
  return (
    <Box>
      <Text dimColor>{label}: </Text>
      <Text>{value}</Text>
    </Box>
  );
}
