# /entity-list

List entities with summary view.

## Usage

```
/entity-list [type] [--path <pattern>] [--tree]
```

## Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `type` | Entity type to list | all |
| `--path` | Filter by path pattern | * |
| `--tree` | Show as tree structure | false |

## Entity Types

- `class` - Classes
- `function` - Functions
- `method` - Methods
- `module` - Modules
- `document` - Markdown docs
- `config` - Configuration files
- `all` - All types

## Examples

```bash
# List all entities
/entity-list

# List all classes
/entity-list class

# List functions in specific path
/entity-list function --path entity_store/parsers/*

# Show as tree
/entity-list --tree
```

## Output Formats

### Table (default)

```
┌──────────┬─────────────────────┬──────────────────────────────┐
│ Type     │ Name                │ Path                         │
├──────────┼─────────────────────┼──────────────────────────────┤
│ class    │ Entity              │ entity_store/models.py       │
│ class    │ EntityRegistry      │ entity_store/registry.py     │
│ function │ get_parser          │ entity_store/parsers/__init__|
└──────────┴─────────────────────┴──────────────────────────────┘
```

### Tree (--tree)

```
entity_store/
├── models.py
│   ├── [class] Entity
│   ├── [class] EntityType
│   └── [class] EntityState
├── registry.py
│   └── [class] EntityRegistry
└── parsers/
    ├── python_parser.py
    │   ├── [class] PythonParser
    │   └── [class] PythonEntityExtractor
    └── typescript_parser.py
        └── [class] TypeScriptParser
```
