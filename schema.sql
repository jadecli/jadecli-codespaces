-- ---
-- entity_id: schema-neon
-- entity_name: Neon PostgreSQL Schema
-- entity_type_id: schema
-- entity_path: schema.sql
-- entity_language: sql
-- entity_state: active
-- entity_created: 2026-01-22T16:00:00Z
-- entity_exports: [entities, query_cache, entity_changes]
-- ---

-- Entity Store Schema for Neon PostgreSQL
-- Provides AST-based entity indexing with BM25 search

-- Main entities table
CREATE TABLE IF NOT EXISTS entities (
    entity_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_name TEXT NOT NULL,
    entity_type_id TEXT NOT NULL,
    entity_frontmatter_signature TEXT,
    entity_last_updated TIMESTAMPTZ DEFAULT NOW(),
    entity_state TEXT DEFAULT 'active',
    entity_created TIMESTAMPTZ DEFAULT NOW(),

    -- Extended fields
    entity_path TEXT NOT NULL,
    entity_line_start INTEGER,
    entity_line_end INTEGER,
    entity_parent_id UUID REFERENCES entities(entity_id) ON DELETE SET NULL,
    entity_language TEXT,
    entity_signature TEXT,
    entity_docstring TEXT,
    entity_metadata JSONB DEFAULT '{}',

    -- Full-text search vector
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english',
            coalesce(entity_name, '') || ' ' ||
            coalesce(entity_docstring, '') || ' ' ||
            coalesce(entity_path, '')
        )
    ) STORED,

    -- Unique constraint for deduplication
    UNIQUE(entity_path, entity_type_id, entity_name, entity_line_start)
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_entities_type ON entities(entity_type_id);
CREATE INDEX IF NOT EXISTS idx_entities_path ON entities(entity_path);
CREATE INDEX IF NOT EXISTS idx_entities_state ON entities(entity_state);
CREATE INDEX IF NOT EXISTS idx_entities_parent ON entities(entity_parent_id);
CREATE INDEX IF NOT EXISTS idx_entities_search ON entities USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_entities_created ON entities(entity_created);

-- Query cache table for token reduction
CREATE TABLE IF NOT EXISTS query_cache (
    cache_key TEXT PRIMARY KEY,
    cache_value JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    hit_count INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_cache_expires ON query_cache(expires_at);

-- Change log for cache invalidation
CREATE TABLE IF NOT EXISTS entity_changes (
    change_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID REFERENCES entities(entity_id) ON DELETE SET NULL,
    entity_path TEXT,
    change_type TEXT NOT NULL,  -- 'create', 'update', 'delete'
    changed_at TIMESTAMPTZ DEFAULT NOW(),
    old_signature TEXT,
    new_signature TEXT
);

CREATE INDEX IF NOT EXISTS idx_changes_time ON entity_changes(changed_at);
CREATE INDEX IF NOT EXISTS idx_changes_path ON entity_changes(entity_path);

-- Index metadata (tracks last indexing time per repo)
CREATE TABLE IF NOT EXISTS index_metadata (
    repo_path TEXT PRIMARY KEY,
    last_indexed_at TIMESTAMPTZ DEFAULT NOW(),
    entity_count INTEGER DEFAULT 0,
    file_count INTEGER DEFAULT 0
);

-- Function: Search entities with BM25
CREATE OR REPLACE FUNCTION search_entities(
    query_text TEXT,
    result_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
    entity_id UUID,
    entity_name TEXT,
    entity_type_id TEXT,
    entity_path TEXT,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.entity_id,
        e.entity_name,
        e.entity_type_id,
        e.entity_path,
        ts_rank(e.search_vector, plainto_tsquery('english', query_text)) AS rank
    FROM entities e
    WHERE e.search_vector @@ plainto_tsquery('english', query_text)
      AND e.entity_state = 'active'
    ORDER BY rank DESC
    LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;

-- Function: Get entity hierarchy
CREATE OR REPLACE FUNCTION get_entity_hierarchy(root_id UUID)
RETURNS TABLE (
    entity_id UUID,
    entity_name TEXT,
    entity_type_id TEXT,
    depth INTEGER
) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE hierarchy AS (
        SELECT e.entity_id, e.entity_name, e.entity_type_id, 0 AS depth
        FROM entities e
        WHERE e.entity_id = root_id

        UNION ALL

        SELECT e.entity_id, e.entity_name, e.entity_type_id, h.depth + 1
        FROM entities e
        INNER JOIN hierarchy h ON e.entity_parent_id = h.entity_id
        WHERE h.depth < 10  -- Prevent infinite recursion
    )
    SELECT * FROM hierarchy
    ORDER BY depth, entity_name;
END;
$$ LANGUAGE plpgsql;
