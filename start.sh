#!/usr/bin/env bash
# One-command start for Replit (or any host): build the frontend, then run the API,
# which also serves web/dist. The host sets PORT.
set -e
cd "$(dirname "$0")"
(cd web && npm ci --include=dev && npm run build)
(cd server && npm ci --include=dev && npm start)
