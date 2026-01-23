// ---
// entity_id: component-progress-bar
// entity_name: Progress Bar Component
// entity_type_id: class
// entity_path: entity_cli/src/components/ProgressBar.tsx
// entity_language: typescript
// entity_state: active
// entity_created: 2026-01-22T16:00:00Z
// entity_exports: [ProgressBar]
// entity_dependencies: []
// ---

/**
 * Progress Bar Component
 *
 * Terminal progress bar for:
 * - Index building progress
 * - File parsing progress
 * - Upload progress
 */

import React from 'react';
import { Box, Text } from 'ink';

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  width?: number;
  showPercentage?: boolean;
}

/**
 * Terminal progress bar component.
 */
export function ProgressBar({
  progress,
  label = 'Progress',
  width = 40,
  showPercentage = true,
}: ProgressBarProps): React.ReactElement {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const filledWidth = Math.round((clampedProgress / 100) * width);
  const emptyWidth = width - filledWidth;

  const filledBar = '█'.repeat(filledWidth);
  const emptyBar = '░'.repeat(emptyWidth);

  return (
    <Box>
      <Text>{label}: </Text>
      <Text color="green">{filledBar}</Text>
      <Text dimColor>{emptyBar}</Text>
      {showPercentage && (
        <Text> {clampedProgress.toFixed(0)}%</Text>
      )}
    </Box>
  );
}

interface MultiProgressProps {
  items: Array<{
    label: string;
    progress: number;
  }>;
  width?: number;
}

/**
 * Multiple progress bars stacked vertically.
 */
export function MultiProgress({
  items,
  width = 30,
}: MultiProgressProps): React.ReactElement {
  return (
    <Box flexDirection="column">
      {items.map((item, index) => (
        <ProgressBar
          key={index}
          label={item.label}
          progress={item.progress}
          width={width}
        />
      ))}
    </Box>
  );
}
