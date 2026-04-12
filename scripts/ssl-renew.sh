#!/bin/bash
# =============================================================================
# SSL Certificate Renewal & Status Check Script
# Run this to check certificate status and renew if needed
# =============================================================================

set -euo pipefail

DOMAIN="6phene.com"

echo "============================================"
echo "  6phene SSL Certificate Status Check"
echo "  $(date '+%Y-%m-%d %H:%M:%S')"
echo "============================================"
echo ""

# Check if certbot is installed
if ! command -v certbot &> /dev/null; then
    echo "[ERROR] Certbot is not installed. Run ssl-setup.sh first."
    exit 1
fi

# Show certificate details
echo "[*] Current certificate status:"
echo "--------------------------------------------"
sudo certbot certificates 2>/dev/null
echo "--------------------------------------------"
echo ""

# Parse expiry and check
CERT_PATH="/etc/letsencrypt/live/$DOMAIN/fullchain.pem"
if [ -f "$CERT_PATH" ]; then
    EXPIRY=$(openssl x509 -enddate -noout -in "$CERT_PATH" | cut -d= -f2)
    EXPIRY_EPOCH=$(date -d "$EXPIRY" +%s)
    NOW_EPOCH=$(date +%s)
    DAYS_LEFT=$(( (EXPIRY_EPOCH - NOW_EPOCH) / 86400 ))

    echo "[*] Certificate expires: $EXPIRY"
    echo "[*] Days remaining: $DAYS_LEFT"
    echo ""

    if [ "$DAYS_LEFT" -le 0 ]; then
        echo "[CRITICAL] Certificate has EXPIRED!"
        echo "[*] Attempting immediate renewal..."
        sudo certbot renew --force-renewal
        sudo systemctl reload nginx
        echo "[+] Certificate renewed and Nginx reloaded."
    elif [ "$DAYS_LEFT" -le 7 ]; then
        echo "[WARNING] Certificate expires in $DAYS_LEFT days!"
        echo "[*] Renewing now..."
        sudo certbot renew
        sudo systemctl reload nginx
        echo "[+] Renewal attempted and Nginx reloaded."
    elif [ "$DAYS_LEFT" -le 30 ]; then
        echo "[NOTICE] Certificate expires in $DAYS_LEFT days."
        echo "[*] Running renewal check..."
        sudo certbot renew
        echo "[+] Renewal check complete."
    else
        echo "[OK] Certificate is healthy ($DAYS_LEFT days remaining)."
    fi
else
    echo "[ERROR] Certificate not found at $CERT_PATH"
    echo "[*] Run ssl-setup.sh to obtain a certificate."
    exit 1
fi

echo ""
echo "[*] Auto-renewal timer status:"
systemctl status certbot.timer --no-pager 2>/dev/null || echo "  (systemd timer not active - check cron with: sudo crontab -l)"
echo ""
echo "[+] Status check complete."
