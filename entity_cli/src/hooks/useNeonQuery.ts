// ---
// entity_id: hook-use-neon-query
// entity_name: Neon Query Hook
// entity_type_id: function
// entity_path: entity_cli/src/hooks/useNeonQuery.ts
// entity_language: typescript
// entity_state: active
// entity_created: 2026-01-22T16:00:00Z
// entity_exports: [useNeonQuery, NeonQueryResult]
// entity_dependencies: [python_bridge]
// ---

/**
 * React hook for querying Neon PostgreSQL.
 *
 * Provides a convenient interface for:
 * - Executing SQL queries via Python bridge
 * - Caching query results
 * - Handling loading and error states
 */

import { useState, useEffect, useCallback } from 'react';
import { callPython } from '../../bridge/python_bridge.js';

export interface NeonQueryResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook for executing Neon PostgreSQL queries.
 *
 * @param query - SQL query string
 * @param params - Query parameters
 * @returns Query result with loading and error states
 */
export function useNeonQuery<T>(
  query: string,
  params: unknown[] = []
): NeonQueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await callPython<T>('query', { query, params });
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Query failed');
    } finally {
      setLoading(false);
    }
  }, [query, JSON.stringify(params)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook for executing Neon mutations (INSERT, UPDATE, DELETE).
 */
export function useNeonMutation<T>(): {
  mutate: (query: string, params?: unknown[]) => Promise<T>;
  loading: boolean;
  error: string | null;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (query: string, params: unknown[] = []): Promise<T> => {
      setLoading(true);
      setError(null);

      try {
        const result = await callPython<T>('mutate', { query, params });
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Mutation failed';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { mutate, loading, error };
}
