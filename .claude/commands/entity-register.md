# /entity-register

Register a new entity in the store.

## Usage

```
/entity-register <path> [--type <type>] [--name <name>]
```

## Parameters

| Parameter | Description | Required |
|-----------|-------------|----------|
| `path` | File path to register | Yes |
| `--type` | Entity type | Auto-detected |
| `--name` | Entity name | Auto-detected |

## Behavior

1. Parses the file using appropriate AST parser
2. Extracts entities (classes, functions, etc.)
3. Computes frontmatter signatures for change detection
4. Upserts entities to Neon PostgreSQL
5. Updates local cache
6. Logs changes for cache invalidation

## Examples

```bash
# Register a single file
/entity-register entity_store/models.py

# Register with explicit type
/entity-register CLAUDE.md --type document

# Register entire directory
/entity-register entity_store/
```

## Auto-detection

| Extension | Parser | Types Extracted |
|-----------|--------|-----------------|
| `.py` | Python AST | class, function, method |
| `.ts`, `.tsx` | TypeScript | class, function, interface |
| `.md` | Markdown | document, heading, code_block |
| `.json`, `.toml`, `.yaml` | Config | config |
| `.sql` | SQL | schema |

## Output

```
Registered 5 entities from entity_store/models.py:
  [class] Entity (lines 30-85)
  [class] EntityType (lines 18-28)
  [class] EntityState (lines 10-16)
  [function] compute_signature (lines 70-74)
  [method] to_search_text (lines 80-85)
```

## Notes

- Files without frontmatter will have it auto-generated
- Existing entities are updated (upsert behavior)
- Changes are logged for cache invalidation
