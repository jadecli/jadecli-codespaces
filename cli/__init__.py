# ---
# entity_id: module-cli
# entity_name: CLI Package
# entity_type_id: module
# entity_path: cli/__init__.py
# entity_language: python
# entity_state: active
# entity_created: 2026-01-22T17:00:00Z
# entity_exports: [settings]
# entity_dependencies: []
# entity_semver_impact: minor
# ---

"""
CLI Package - Centralized configuration and CLI tools.

This package provides:
- Centralized settings via pydantic-settings
- CLI commands for entity management
- Configuration loading from .env or GitHub secrets
"""

from cli.settings import settings

__all__ = ["settings"]
