// ---
// entity_id: hook-use-entity-store
// entity_name: Entity Store Hook
// entity_type_id: function
// entity_path: entity_cli/src/hooks/useEntityStore.ts
// entity_language: typescript
// entity_state: active
// entity_created: 2026-01-22T16:00:00Z
// entity_exports: [useEntityStore, EntityStoreState]
// entity_dependencies: [useNeonQuery]
// ---

/**
 * React hook for entity store state management.
 *
 * Provides:
 * - Entity listing with filters
 * - Entity CRUD operations
 * - Index status tracking
 * - Cache management
 */

import { useState, useEffect, useCallback } from 'react';
import { useNeonQuery, useNeonMutation } from './useNeonQuery.js';

export interface Entity {
  entity_id: string;
  entity_name: string;
  entity_type_id: string;
  entity_path: string;
  entity_line_start: number;
  entity_line_end: number | null;
  entity_language: string;
  entity_state: string;
  entity_docstring: string | null;
}

export interface EntityStoreFilters {
  typeId?: string | null;
  namePattern?: string | null;
  pathPattern?: string | null;
  state?: string;
  limit?: number;
}

export interface EntityStoreState {
  entities: Entity[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  refetch: () => void;
}

/**
 * Hook for accessing entity store with filters.
 *
 * @param filters - Optional filters for entity listing
 * @returns Entity store state with entities and metadata
 */
export function useEntityStore(
  filters: EntityStoreFilters = {}
): EntityStoreState {
  const {
    typeId = null,
    namePattern = null,
    pathPattern = null,
    state = 'active',
    limit = 100,
  } = filters;

  // Build query dynamically based on filters
  const buildQuery = (): { query: string; params: unknown[] } => {
    const conditions: string[] = ['entity_state = $1'];
    const params: unknown[] = [state];
    let paramIndex = 2;

    if (typeId) {
      conditions.push(`entity_type_id = $${paramIndex}`);
      params.push(typeId);
      paramIndex++;
    }

    if (namePattern) {
      conditions.push(`entity_name LIKE $${paramIndex}`);
      params.push(namePattern.replace('*', '%'));
      paramIndex++;
    }

    if (pathPattern) {
      conditions.push(`entity_path LIKE $${paramIndex}`);
      params.push(pathPattern.replace('*', '%'));
      paramIndex++;
    }

    const query = `
      SELECT entity_id, entity_name, entity_type_id, entity_path,
             entity_line_start, entity_line_end, entity_language,
             entity_state, entity_docstring
      FROM entities
      WHERE ${conditions.join(' AND ')}
      ORDER BY entity_path, entity_line_start
      LIMIT $${paramIndex}
    `;
    params.push(limit);

    return { query, params };
  };

  const { query, params } = buildQuery();
  const { data, loading, error, refetch } = useNeonQuery<Entity[]>(query, params);

  return {
    entities: data || [],
    loading,
    error,
    totalCount: data?.length || 0,
    refetch,
  };
}

/**
 * Hook for entity search.
 */
export function useEntitySearch(): {
  search: (queryText: string, limit?: number) => Promise<Entity[]>;
  loading: boolean;
  error: string | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate } = useNeonMutation<Entity[]>();

  const search = useCallback(
    async (queryText: string, limit = 20): Promise<Entity[]> => {
      setLoading(true);
      setError(null);

      try {
        const result = await mutate(
          `SELECT * FROM search_entities($1, $2)`,
          [queryText, limit]
        );
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Search failed';
        setError(errorMessage);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [mutate]
  );

  return { search, loading, error };
}
