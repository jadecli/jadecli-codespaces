#!/usr/bin/env bash
# Entity Store - Environment Setup & Verification
# Run this at the start of each session

set -euo pipefail

echo "=== Entity Store Init ==="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check() {
    if "$@" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1"
        return 1
    fi
}

warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# 1. Check Python
echo "Checking dependencies..."
check python --version || { echo "Python 3.12+ required"; exit 1; }
check node --version || warn "Node.js not found (optional for entity_cli)"

# 2. Install Python dependencies
if [[ -f pyproject.toml ]]; then
    echo ""
    echo "Installing Python dependencies..."
    if command -v uv &> /dev/null; then
        uv pip install -e ".[dev]" 2>/dev/null || uv pip install -e . 2>/dev/null || warn "Could not install dependencies"
    else
        pip install -e ".[dev]" 2>/dev/null || pip install -e . 2>/dev/null || warn "Could not install dependencies"
    fi
fi

# 3. Install Node dependencies
if [[ -f entity_cli/package.json ]]; then
    echo ""
    echo "Installing Node dependencies..."
    (cd entity_cli && npm install 2>/dev/null) || warn "Could not install Node dependencies"
fi

# 4. Verify entity_store imports
echo ""
echo "Verifying imports..."
check python -c "from entity_store import Entity" || warn "entity_store not yet importable (scaffolding)"

# 5. Verify TypeScript compiles
if [[ -f entity_cli/tsconfig.json ]]; then
    check "cd entity_cli && npx tsc --noEmit" || warn "TypeScript not yet compiling (scaffolding)"
fi

# 6. Check features.json
echo ""
echo "Feature Status:"
if [[ -f features.json ]]; then
    python3 -c "
import json
with open('features.json') as f:
    data = json.load(f)
pending = sum(1 for f in data['features'] if f['status'] == 'pending')
passing = sum(1 for f in data['features'] if f['status'] == 'passing')
total = len(data['features'])
print(f'  Pending: {pending}/{total}')
print(f'  Passing: {passing}/{total}')
" 2>/dev/null || echo "  Could not read features.json"
fi

# 7. Git status
echo ""
echo "Git Status:"
git status --short 2>/dev/null | head -10 || echo "  Not a git repo"

echo ""
echo "=== Init Complete ==="
