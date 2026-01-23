# Entity Store Rule

All new code entities MUST be registered in the entity store.

## When Creating New Entities

Before creating any new:
- File
- Class
- Method/Function
- Parameter
- Configuration

You MUST:
1. Check if entity already exists: `/entity-query type_id=<type> name=<name>`
2. If new, register via frontmatter or explicit registration
3. Use standardized entity_type_id values

## Entity Type IDs

| Type | Description |
|------|-------------|
| `class` | Python/TS class definition |
| `method` | Class method |
| `function` | Standalone function |
| `param` | Function/method parameter |
| `heading` | Markdown heading |
| `code_block` | Fenced code block |
| `document` | Markdown document |
| `config` | Configuration file |
| `module` | Python/TS module |
| `schema` | Database schema |

## Frontmatter for New Files

Every new file in `context/`, `entity_store/`, or `entity_cli/` must have frontmatter:

### Python Files
```python
# ---
# entity_id: <type>-<name>
# entity_name: <Descriptive Name>
# entity_type_id: <type>
# entity_path: <relative/path.py>
# entity_language: python
# entity_state: active
# entity_created: <ISO-8601>
# entity_exports: [<exported classes/functions>]
# entity_dependencies: [<imported modules>]
# ---
```

### TypeScript Files
```typescript
// ---
// entity_id: <type>-<name>
// entity_name: <Descriptive Name>
// entity_type_id: <type>
// entity_path: <relative/path.ts>
// entity_language: typescript
// entity_state: active
// entity_created: <ISO-8601>
// entity_exports: [<exported items>]
// entity_dependencies: [<imported modules>]
// ---
```

### Markdown Files
```yaml
---
entity_id: <type>-<name>
entity_name: <Descriptive Name>
entity_type_id: document
entity_path: <relative/path.md>
entity_language: markdown
entity_state: active
entity_created: <ISO-8601>
---
```

## Benefits of Frontmatter

1. **Fast Indexing**: Recursive scan reads metadata without full AST parse
2. **Dependency Tracking**: `entity_dependencies` enables graph visualization
3. **ASCII Diagrams**: Can auto-generate architecture from entity relationships
4. **Change Detection**: `entity_frontmatter_signature` tracks modifications
5. **Token Reduction**: Query specific fields instead of full file content

## Validation

On each file edit, the post-tool-use hook will:
1. Verify frontmatter exists (for tracked directories)
2. Validate entity_type_id is valid
3. Update entity_last_updated in the index
4. Invalidate related cache entries
