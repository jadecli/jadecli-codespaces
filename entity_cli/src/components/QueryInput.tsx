// ---
// entity_id: component-query-input
// entity_name: Query Input Component
// entity_type_id: class
// entity_path: entity_cli/src/components/QueryInput.tsx
// entity_language: typescript
// entity_state: active
// entity_created: 2026-01-22T16:00:00Z
// entity_exports: [QueryInput]
// entity_dependencies: []
// ---

/**
 * Query Input Component
 *
 * GraphQL-like query input with:
 * - Syntax highlighting
 * - Auto-completion for fields
 * - Query history
 * - Validation feedback
 */

import React, { useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';

interface QueryInputProps {
  onSubmit: (query: string) => void;
  placeholder?: string;
}

interface QueryState {
  value: string;
  isValid: boolean;
  error: string | null;
}

/**
 * Query input component with validation.
 */
export function QueryInput({
  onSubmit,
  placeholder = 'type_id=class fields=entity_name,entity_path',
}: QueryInputProps): React.ReactElement {
  const [state, setState] = useState<QueryState>({
    value: '',
    isValid: true,
    error: null,
  });

  const handleChange = (value: string): void => {
    // Validate query format
    const isValid = validateQuery(value);
    setState({
      value,
      isValid: isValid.valid,
      error: isValid.error,
    });
  };

  const handleSubmit = (value: string): void => {
    if (state.isValid) {
      onSubmit(value);
    }
  };

  return (
    <Box flexDirection="column">
      <Box>
        <Text color="cyan">Query: </Text>
        <TextInput
          value={state.value}
          onChange={handleChange}
          onSubmit={handleSubmit}
          placeholder={placeholder}
        />
      </Box>

      {state.error && (
        <Box marginTop={1}>
          <Text color="red">Error: {state.error}</Text>
        </Box>
      )}

      <Box marginTop={1}>
        <Text dimColor>
          Format: type_id=X name=pattern path=pattern fields=f1,f2
        </Text>
      </Box>
    </Box>
  );
}

interface ValidationResult {
  valid: boolean;
  error: string | null;
}

function validateQuery(query: string): ValidationResult {
  // Stub validation - to be implemented
  if (!query) {
    return { valid: true, error: null };
  }

  const validKeys = ['type_id', 'name', 'path', 'fields', 'limit', 'state'];
  const parts = query.split(/\s+/);

  for (const part of parts) {
    if (!part.includes('=')) {
      return { valid: false, error: `Invalid format: ${part}` };
    }
    const [key] = part.split('=');
    if (!validKeys.includes(key)) {
      return { valid: false, error: `Unknown key: ${key}` };
    }
  }

  return { valid: true, error: null };
}
