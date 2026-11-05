#!/bin/sh
set -eu

if ! printf '%s' "${BACKUP_RETENTION_DAYS:-7}" | grep -Eq '^[1-9][0-9]{0,4}$'; then
    echo 'BACKUP_RETENTION_DAYS doit être un entier positif (1 à 99999).' >&2
    exit 1
fi

mkdir -p /backups
chmod 700 /backups
exec crond -f -l 2
