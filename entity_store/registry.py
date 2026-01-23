# ---
# entity_id: module-registry
# entity_name: Entity Registry
# entity_type_id: module
# entity_path: entity_store/registry.py
# entity_language: python
# entity_state: active
# entity_created: 2026-01-22T16:00:00Z
# entity_exports: [EntityRegistry]
# entity_dependencies: [models, neon_client, parsers]
# ---

"""
Entity Registry - CRUD operations for entities.

Provides the main interface for:
- Registering new entities from parsed AST
- Querying entities by type, path, name
- Updating entity state and metadata
- Deleting/archiving entities
"""

from pathlib import Path
from typing import Optional
from uuid import UUID

from entity_store.models import Entity, EntityType, EntityState
from entity_store.neon_client import NeonClient


class EntityRegistry:
    """
    Central registry for entity CRUD operations.

    Coordinates between AST parsers and Neon PostgreSQL storage.
    """

    def __init__(self, client: NeonClient) -> None:
        """Initialize registry with Neon client."""
        self.client = client
        self._parser_cache: dict[str, object] = {}

    def parse_file(self, filepath: Path) -> list[Entity]:
        """
        Parse a file and extract entities.

        Args:
            filepath: Path to the file to parse

        Returns:
            List of Entity objects extracted from the file
        """
        # Stub - implementation will dispatch to appropriate parser
        raise NotImplementedError("parse_file not yet implemented")

    def register(self, entity: Entity) -> UUID:
        """
        Register a new entity in the store.

        Args:
            entity: Entity to register

        Returns:
            UUID of the registered entity
        """
        raise NotImplementedError("register not yet implemented")

    def get(self, entity_id: UUID) -> Optional[Entity]:
        """
        Get an entity by ID.

        Args:
            entity_id: UUID of the entity

        Returns:
            Entity if found, None otherwise
        """
        raise NotImplementedError("get not yet implemented")

    def filter(
        self,
        type_id: Optional[EntityType] = None,
        name_pattern: Optional[str] = None,
        path_pattern: Optional[str] = None,
        state: EntityState = EntityState.ACTIVE,
    ) -> list[Entity]:
        """
        Filter entities by criteria.

        Args:
            type_id: Filter by entity type
            name_pattern: Filter by name pattern (glob)
            path_pattern: Filter by path pattern (glob)
            state: Filter by state (default: active)

        Returns:
            List of matching entities
        """
        raise NotImplementedError("filter not yet implemented")

    def update(self, entity_id: UUID, **fields) -> Entity:
        """
        Update entity fields.

        Args:
            entity_id: UUID of the entity to update
            **fields: Fields to update

        Returns:
            Updated entity
        """
        raise NotImplementedError("update not yet implemented")

    def archive(self, entity_id: UUID) -> None:
        """
        Archive an entity (soft delete).

        Args:
            entity_id: UUID of the entity to archive
        """
        raise NotImplementedError("archive not yet implemented")

    def delete(self, entity_id: UUID) -> None:
        """
        Permanently delete an entity.

        Args:
            entity_id: UUID of the entity to delete
        """
        raise NotImplementedError("delete not yet implemented")
