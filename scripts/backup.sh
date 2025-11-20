# /apps/secret-note-app/scripts/backup.sh
#!/usr/bin/env bash
set -e
TS=$(date +'%Y%m%d_%H%M%S')
docker exec $(docker compose ps -q mongo) mongodump --archive=/data/db/backup_$TS.archive
docker cp $(docker compose ps -q mongo):/data/db/backup_$TS.archive /apps/secret-note-data/backups/
docker exec $(docker compose ps -q mongo) rm /data/db/backup_$TS.archive
