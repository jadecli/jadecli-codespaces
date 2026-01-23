# ---
# entity_id: module-query
# entity_name: Query Package
# entity_type_id: module
# entity_path: entity_store/query/__init__.py
# entity_language: python
# entity_state: active
# entity_created: 2026-01-22T16:00:00Z
# entity_exports: [EntityQuery]
# entity_dependencies: [graphql]
# ---

"""
Query interface for entity store.

Provides GraphQL-like query capabilities:
- Field projection (reduce token usage)
- Filtering by type, name, path
- Hierarchical queries
- Full-text search
"""

from entity_store.query.graphql import EntityQuery

__all__ = ["EntityQuery"]
