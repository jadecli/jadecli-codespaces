// ---
// entity_id: module-cli-entry
// entity_name: CLI Entry Point
// entity_type_id: module
// entity_path: entity_cli/src/index.tsx
// entity_language: typescript
// entity_state: active
// entity_created: 2026-01-22T16:00:00Z
// entity_exports: [main]
// entity_dependencies: [App]
// ---

/**
 * Entity CLI Entry Point
 *
 * React Ink application for interactive entity browsing and queries.
 * Provides a terminal UI for:
 * - Browsing entities by type
 * - Searching with full-text
 * - Viewing entity details
 * - Query building
 */

import React from 'react';
import { render } from 'ink';
import { App } from './App.js';

/**
 * Main entry point for the CLI application.
 */
async function main(): Promise<void> {
  const { waitUntilExit } = render(<App />);
  await waitUntilExit();
}

main().catch(console.error);
