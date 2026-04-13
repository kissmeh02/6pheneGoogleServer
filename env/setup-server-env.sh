#!/bin/bash
# =============================================================================
# Server Environment Setup
# Configures systemd services to use the centralized .env file
# Run on the production server after deploying .env
# =============================================================================

set -euo pipefail

ENV_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$ENV_DIR/.env"

if [ ! -f "$ENV_FILE" ]; then
    echo "[ERROR] .env file not found. Create it first:"
    echo "        cp $ENV_DIR/.env.example $ENV_FILE"
    echo "        Then edit $ENV_FILE with your actual values."
    exit 1
fi

# Secure the .env file
chmod 600 "$ENV_FILE"
echo "[+] Secured .env file permissions (600)"

# Source the env file
source "$ENV_DIR/load-env.sh"

# Update gemini-proxy systemd service to use EnvironmentFile
if [ -f /etc/systemd/system/gemini-proxy.service ]; then
    cat > /etc/systemd/system/gemini-proxy.service << EOF
[Unit]
Description=Gemini API Proxy for 6phene Chat Widget
After=network.target

[Service]
Type=simple
EnvironmentFile=$ENV_FILE
ExecStart=/usr/bin/python3 /root/webbpage/webpage/api/gemini-proxy.py
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
    sudo systemctl daemon-reload
    sudo systemctl restart gemini-proxy
    echo "[+] Updated gemini-proxy service to use EnvironmentFile"
fi

echo ""
echo "[+] Server environment configured."
echo "    Secrets are loaded from: $ENV_FILE"
echo "    File permissions: $(stat -c '%a' "$ENV_FILE" 2>/dev/null || stat -f '%Lp' "$ENV_FILE" 2>/dev/null)"
