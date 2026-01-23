# Settings Rule - Centralized Configuration

## Golden Rule

**NEVER hardcode secrets, API keys, or environment-specific values in code.**

All configuration MUST be accessed through `cli/settings.py`.

## How It Works

```python
# ✅ CORRECT - Use settings
from cli.settings import settings

api_key = settings.parallel_apikey
db_url = settings.database_url

# ❌ WRONG - Never do this
api_key = "sk-abc123..."  # Hardcoded secret
db_url = os.environ["DATABASE_URL"]  # Direct env access
```

## Settings Structure

```
cli/settings.py          # Pydantic Settings class (source of truth)
.env                      # Local development (gitignored)
.env.example              # Template for .env (committed)
GitHub Secrets            # CI/CD (org or repo level)
```

## Adding New Configuration

1. **Add to `.env.example`** (template):
   ```dotenv
   NEW_API_KEY=
   ```

2. **Add to `cli/settings.py`**:
   ```python
   class Settings(BaseSettings):
       new_api_key: Optional[str] = Field(
           default=None,
           description="API key for new service",
       )
   ```

3. **Add to local `.env`** (not committed):
   ```dotenv
   NEW_API_KEY=actual-secret-value
   ```

4. **For CI/CD**, add to GitHub Secrets:
   - Repository: Settings → Secrets → Actions
   - Organization: Settings → Secrets

## Environment Detection

```python
from cli.settings import settings

if settings.is_ci:
    # Running in GitHub Actions
    # Secrets come from GitHub Secrets
else:
    # Local development
    # Secrets come from .env file
```

## Available Settings

| Setting | Type | Description |
|---------|------|-------------|
| `parallel_apikey` | str | Claude parallel API key |
| `neon_api_key` | str | Neon PostgreSQL API key |
| `anthropic_api_key` | str | Anthropic API key |
| `github_token` | str | GitHub API token |
| `database_url` | str | PostgreSQL connection string |
| `environment` | str | development/staging/production |
| `debug` | bool | Debug mode flag |
| `max_parallel_requests` | int | Max concurrent API calls |

## Security Checklist

- [ ] Never commit `.env` (it's gitignored)
- [ ] Keep `.env.example` updated with all keys (no values)
- [ ] Use `settings.has_*` properties to check availability
- [ ] Use GitHub Secrets for CI/CD
- [ ] Never log secret values

## Pre-commit Protection

The `detect-secrets` hook prevents accidental commits of secrets.
If triggered, it means you may have hardcoded a secret.
