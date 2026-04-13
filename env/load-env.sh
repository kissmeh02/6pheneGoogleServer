#!/bin/bash
# =============================================================================
# Load environment variables from .env file
# Usage: source env/load-env.sh [environment]
#   environment: production (default), development, staging
# =============================================================================

ENV_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENVIRONMENT="${1:-production}"
ENV_FILE="$ENV_DIR/.env"

if [ ! -f "$ENV_FILE" ]; then
    echo "[ERROR] .env file not found at $ENV_FILE"
    echo "        Copy .env.example to .env and fill in your values:"
    echo "        cp $ENV_DIR/.env.example $ENV_FILE"
    return 1 2>/dev/null || exit 1
fi

# Export all variables from .env (skip comments and blank lines)
set -a
while IFS= read -r line || [ -n "$line" ]; do
    # Skip comments and empty lines
    [[ "$line" =~ ^[[:space:]]*# ]] && continue
    [[ -z "${line// }" ]] && continue
    # Only export valid KEY=VALUE lines
    if [[ "$line" =~ ^[A-Za-z_][A-Za-z0-9_]*= ]]; then
        eval "$line"
    fi
done < "$ENV_FILE"
set +a

echo "[+] Environment loaded from $ENV_FILE"
