#!/bin/sh
set -eu
umask 077

retention=${BACKUP_RETENTION_DAYS:-7}
if ! printf '%s' "$retention" | grep -Eq '^[1-9][0-9]{0,4}$'; then
    echo 'BACKUP_RETENTION_DAYS doit être un entier positif (1 à 99999).' >&2
    exit 1
fi

mkdir -p /backups
chmod 700 /backups
temporary=$(mktemp "/backups/portfolio_$(date +%Y-%m-%d_%H-%M-%S)_XXXXXX")
trap 'rm -f "$temporary"' EXIT
trap 'exit 1' HUP INT TERM

pg_dump --format=custom --no-password --file="$temporary"
chmod 600 "$temporary"
archive=$temporary.dump
mv "$temporary" "$archive"
find /backups -type f -name 'portfolio_*.dump' -mmin "+$((retention * 1440))" -delete
echo "Sauvegarde terminée : $archive"
