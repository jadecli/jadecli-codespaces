# /entity-query

Query entities in the store with GraphQL-like filtering.

## Usage

```
/entity-query [type_id=<type>] [name=<pattern>] [path=<pattern>] [fields=<f1,f2>]
```

## Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `type_id` | Filter by entity type | `type_id=class` |
| `name` | Filter by name pattern (glob) | `name=*Parser*` |
| `path` | Filter by path pattern (glob) | `path=entity_store/*.py` |
| `fields` | Comma-separated fields to return | `fields=entity_name,entity_path` |
| `state` | Filter by state | `state=active` |
| `limit` | Maximum results | `limit=50` |

## Available Fields

- `entity_id` - UUID
- `entity_name` - Name
- `entity_type_id` - Type
- `entity_path` - File path
- `entity_line_start` - Start line
- `entity_line_end` - End line
- `entity_language` - Language
- `entity_state` - State
- `entity_docstring` - Documentation
- `entity_signature` - Signature
- `entity_parent_id` - Parent UUID

## Examples

```bash
# List all classes
/entity-query type_id=class

# Find functions matching pattern
/entity-query type_id=function name=*parse*

# Get specific fields only (reduces tokens)
/entity-query type_id=class fields=entity_name,entity_path

# Query by file path
/entity-query path=entity_store/*.py

# Combine filters
/entity-query type_id=method path=entity_cli/* fields=entity_name,entity_signature
```

## Output

Returns JSON with requested fields:
```json
[
  {"entity_name": "Entity", "entity_path": "entity_store/models.py"},
  {"entity_name": "EntityRegistry", "entity_path": "entity_store/registry.py"}
]
```

## Token Savings

Using field projection reduces output tokens by ~90%:

| Query | Without fields | With fields | Savings |
|-------|---------------|-------------|---------|
| All classes | ~500 tokens | ~50 tokens | 90% |
| 10 functions | ~250 tokens | ~30 tokens | 88% |
