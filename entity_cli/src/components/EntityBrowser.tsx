// ---
// entity_id: component-entity-browser
// entity_name: Entity Browser Component
// entity_type_id: class
// entity_path: entity_cli/src/components/EntityBrowser.tsx
// entity_language: typescript
// entity_state: active
// entity_created: 2026-01-22T16:00:00Z
// entity_exports: [EntityBrowser]
// entity_dependencies: [useEntityStore]
// ---

/**
 * Entity Browser Component
 *
 * Interactive list component for browsing entities.
 * Features:
 * - Filter by entity type
 * - Keyboard navigation
 * - Type-based grouping
 * - Quick search
 */

import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import { useEntityStore } from '../hooks/useEntityStore.js';

interface EntityBrowserProps {
  onSelect: (entityId: string) => void;
}

interface EntityItem {
  label: string;
  value: string;
}

/**
 * Interactive entity browser component.
 */
export function EntityBrowser({
  onSelect,
}: EntityBrowserProps): React.ReactElement {
  const [filter, setFilter] = useState<string | null>(null);
  const { entities, loading, error } = useEntityStore({ typeId: filter });

  useInput((input, key) => {
    // Handle keyboard shortcuts
    if (input === 'c') setFilter('class');
    if (input === 'f') setFilter('function');
    if (input === 'm') setFilter('method');
    if (input === 'a') setFilter(null); // all
  });

  if (loading) {
    return (
      <Box>
        <Text>Loading entities...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Text color="red">Error: {error}</Text>
      </Box>
    );
  }

  const items: EntityItem[] = entities.map((e) => ({
    label: `[${e.entity_type_id}] ${e.entity_name} (${e.entity_path})`,
    value: e.entity_id,
  }));

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text>Filter: </Text>
        <Text color="yellow">{filter || 'all'}</Text>
        <Text dimColor> | c=class f=function m=method a=all</Text>
      </Box>

      {items.length === 0 ? (
        <Text dimColor>No entities found</Text>
      ) : (
        <SelectInput
          items={items}
          onSelect={(item) => onSelect(item.value)}
        />
      )}
    </Box>
  );
}
