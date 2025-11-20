# /apps/secret-note-app/scripts/restart.sh
#!/usr/bin/env bash
set -e
cd /apps/secret-note-app
docker compose pull
docker compose build --pull
docker compose up -d
