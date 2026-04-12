#!/bin/bash
# =============================================================================
# SSL/TLS Certificate Setup Script for 6phene.com
# Uses Let's Encrypt (Certbot) for free, auto-renewing certificates
# =============================================================================

set -euo pipefail

DOMAIN="6phene.com"
WWW_DOMAIN="www.6phene.com"
EMAIL="kavankissoon@gmail.com"
WEBROOT="/root/Main/webpage"

echo "============================================"
echo "  6phene SSL/TLS Certificate Setup"
echo "============================================"

# 1. Install Certbot if not present
if ! command -v certbot &> /dev/null; then
    echo "[*] Installing Certbot..."
    sudo apt-get update
    sudo apt-get install -y certbot python3-certbot-nginx
    echo "[+] Certbot installed successfully."
else
    echo "[+] Certbot is already installed."
fi

# 2. Check for existing certificates
echo ""
echo "[*] Checking for existing certificates..."
if sudo certbot certificates 2>/dev/null | grep -q "$DOMAIN"; then
    echo "[!] Existing certificate found for $DOMAIN"
    sudo certbot certificates
    echo ""

    # Check expiry
    EXPIRY=$(sudo certbot certificates 2>/dev/null | grep "Expiry Date:" | awk '{print $3}')
    if [ -n "$EXPIRY" ]; then
        EXPIRY_EPOCH=$(date -d "$EXPIRY" +%s 2>/dev/null || echo "0")
        NOW_EPOCH=$(date +%s)
        DAYS_LEFT=$(( (EXPIRY_EPOCH - NOW_EPOCH) / 86400 ))

        if [ "$DAYS_LEFT" -le 0 ]; then
            echo "[!] Certificate has EXPIRED! Renewing now..."
            sudo certbot renew --force-renewal --nginx
            echo "[+] Certificate renewed successfully."
        elif [ "$DAYS_LEFT" -le 30 ]; then
            echo "[!] Certificate expires in $DAYS_LEFT days. Renewing..."
            sudo certbot renew --nginx
            echo "[+] Certificate renewed successfully."
        else
            echo "[+] Certificate is valid for $DAYS_LEFT more days."
        fi
    fi
else
    echo "[*] No existing certificate found. Obtaining new certificate..."
    echo ""

    # Obtain new certificate using Nginx plugin
    sudo certbot --nginx \
        -d "$DOMAIN" \
        -d "$WWW_DOMAIN" \
        --email "$EMAIL" \
        --agree-tos \
        --no-eff-email \
        --redirect

    echo "[+] Certificate obtained successfully."
fi

# 3. Set up auto-renewal via systemd timer (preferred over cron)
echo ""
echo "[*] Configuring auto-renewal..."

if systemctl is-active --quiet certbot.timer 2>/dev/null; then
    echo "[+] Certbot auto-renewal timer is already active."
else
    # Enable the certbot timer (installed by default with certbot package)
    sudo systemctl enable --now certbot.timer 2>/dev/null || {
        echo "[*] Systemd timer not available, setting up cron-based renewal..."
        # Fallback to cron
        CRON_CMD="0 3 */3 * * certbot renew --quiet --deploy-hook 'systemctl reload nginx' >> /var/log/certbot-renew.log 2>&1"
        (sudo crontab -l 2>/dev/null | grep -v "certbot renew"; echo "$CRON_CMD") | sudo crontab -
        echo "[+] Cron-based auto-renewal configured (runs every 3 days at 3 AM)."
    }
fi

# 4. Configure Certbot renewal hooks to reload Nginx
HOOK_DIR="/etc/letsencrypt/renewal-hooks/deploy"
sudo mkdir -p "$HOOK_DIR"
sudo tee "$HOOK_DIR/reload-nginx.sh" > /dev/null << 'HOOK'
#!/bin/bash
# Reload Nginx after certificate renewal
systemctl reload nginx
echo "[$(date)] Nginx reloaded after certificate renewal" >> /var/log/certbot-renew.log
HOOK
sudo chmod +x "$HOOK_DIR/reload-nginx.sh"
echo "[+] Renewal hook configured to reload Nginx automatically."

# 5. Test renewal (dry run)
echo ""
echo "[*] Testing renewal process (dry run)..."
sudo certbot renew --dry-run
echo "[+] Renewal dry run completed successfully."

# 6. Verify Nginx config and reload
echo ""
echo "[*] Testing Nginx configuration..."
sudo nginx -t
sudo systemctl reload nginx
echo "[+] Nginx reloaded with SSL configuration."

echo ""
echo "============================================"
echo "  SSL Setup Complete!"
echo "============================================"
echo ""
echo "  Domain:      https://$DOMAIN"
echo "  WWW Domain:  https://$WWW_DOMAIN"
echo "  Auto-Renew:  Enabled"
echo "  Cert Path:   /etc/letsencrypt/live/$DOMAIN/"
echo ""
echo "  Useful commands:"
echo "    certbot certificates     - View certificate status"
echo "    certbot renew --dry-run  - Test renewal"
echo "    certbot renew            - Force renewal check"
echo ""
