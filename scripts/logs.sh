# /apps/secret-note-app/scripts/logs.sh
#!/usr/bin/env bash
cd /apps/secret-note-app
docker compose logs -f --tail=200
