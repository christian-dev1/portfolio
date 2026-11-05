#!/bin/sh
# Génère /config/contact.json au démarrage du conteneur à partir des variables d'environnement.
set -eu

CONFIG_DIR=/usr/share/nginx/html/config
CONFIG_FILE="$CONFIG_DIR/contact.json"

clean_digits() { printf '%s' "${1:-}" | tr -cd '0-9'; }
clean_path()   { printf '%s' "${1:-}" | tr -cd 'A-Za-z0-9/._-'; }

WHATSAPP="$(clean_digits "${WHATSAPP_NUMBER:-}")"
CV_FR="$(clean_path "${CV_PDF_FR:-/cv/cv-fr.pdf}")"
CV_EN="$(clean_path "${CV_PDF_EN:-/cv/cv-en.pdf}")"

mkdir -p "$CONFIG_DIR"

cat > "$CONFIG_FILE" <<JSON
{
  "whatsapp": "$WHATSAPP",
  "phones": [],
  "cvPdf": { "fr": "$CV_FR", "en": "$CV_EN" }
}
JSON

chmod 644 "$CONFIG_FILE"

[ -z "$WHATSAPP" ] && echo "contact-config: WHATSAPP_NUMBER absent, bouton WhatsApp masqué"
echo "contact-config: $CONFIG_FILE généré"
