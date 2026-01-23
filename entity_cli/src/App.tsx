// ---
// entity_id: component-app
// entity_name: Main App Component
// entity_type_id: class
// entity_path: entity_cli/src/App.tsx
// entity_language: typescript
// entity_state: active
// entity_created: 2026-01-22T16:00:00Z
// entity_exports: [App]
// entity_dependencies: [EntityBrowser, QueryInput, ProgressBar, EntityDetail]
// ---

/**
 * Main React Ink Application Component
 *
 * Provides the root component for the entity CLI with:
 * - Entity browsing mode
 * - Query input mode
 * - Detail view mode
 * - Index progress display
 */

import React, { useState } from 'react';
import { Box, Text } from 'ink';
import { EntityBrowser } from './components/EntityBrowser.js';
import { QueryInput } from './components/QueryInput.js';
import { ProgressBar } from './components/ProgressBar.js';
import { EntityDetail } from './components/EntityDetail.js';

type ViewMode = 'browse' | 'query' | 'detail' | 'indexing';

interface AppState {
  mode: ViewMode;
  selectedEntityId: string | null;
  isIndexing: boolean;
  indexProgress: number;
}

/**
 * Main application component.
 */
export function App(): React.ReactElement {
  const [state, setState] = useState<AppState>({
    mode: 'browse',
    selectedEntityId: null,
    isIndexing: false,
    indexProgress: 0,
  });

  // Stub implementation - to be completed
  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          Entity Store CLI
        </Text>
        <Text> - </Text>
        <Text dimColor>Mode: {state.mode}</Text>
      </Box>

      {state.isIndexing && (
        <ProgressBar progress={state.indexProgress} label="Indexing" />
      )}

      {state.mode === 'browse' && (
        <EntityBrowser
          onSelect={(id) =>
            setState((s) => ({ ...s, mode: 'detail', selectedEntityId: id }))
          }
        />
      )}

      {state.mode === 'query' && (
        <QueryInput
          onSubmit={(query) => {
            // Handle query submission
            console.log('Query:', query);
          }}
        />
      )}

      {state.mode === 'detail' && state.selectedEntityId && (
        <EntityDetail
          entityId={state.selectedEntityId}
          onBack={() => setState((s) => ({ ...s, mode: 'browse' }))}
        />
      )}

      <Box marginTop={1}>
        <Text dimColor>
          Press 'q' to quit, 'b' for browse, 's' for search
        </Text>
      </Box>
    </Box>
  );
}
