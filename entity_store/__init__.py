# ---
# entity_id: module-entity-store
# entity_name: Entity Store Package
# entity_type_id: module
# entity_path: entity_store/__init__.py
# entity_language: python
# entity_state: active
# entity_created: 2026-01-22T16:00:00Z
# entity_exports: [EntityStore, Entity, EntityRegistry]
# entity_dependencies: [models, registry, cache]
# ---

"""
Entity Store - AST-based entity indexing system for multi-agent Claude collaboration.

This package provides:
- Entity models with Pydantic validation
- AST parsers for Python, TypeScript, and Markdown
- Neon PostgreSQL client for persistent storage
- GraphQL-like query interface
- Local caching for token reduction
"""

from entity_store.models import Entity, EntityType
from entity_store.registry import EntityRegistry
from entity_store.cache import EntityCache

__all__ = ["Entity", "EntityType", "EntityRegistry", "EntityCache"]
__version__ = "0.1.0"
