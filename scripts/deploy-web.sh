#!/usr/bin/env bash
# ============================================================
# deploy-web.sh — Build & Deploy Nuxt (rishipath.com)
# Usage: ./scripts/deploy-web.sh [--skip-build]
# ============================================================
set -euo pipefail

REMOTE_USER="rishipa2"
REMOTE_HOST="192.250.235.21"
REMOTE_PATH="/home/rishipa2/public_applications"
SSH_KEY="$HOME/.ssh/rishipath_deploy"
SSH_OPTS="-i $SSH_KEY -o StrictHostKeyChecking=no"

SKIP_BUILD=false
for arg in "$@"; do
  [[ "$arg" == "--skip-build" ]] && SKIP_BUILD=true
done

# ── 1. Local build ────────────────────────────────────────────
if [ "$SKIP_BUILD" = "false" ]; then
  echo "▶ Building Nuxt app for production..."
  # Point to production API during build
  NUXT_LARAVEL_API_URL=https://api.rishipath.com/api \
  NUXT_LARAVEL_BASE_URL=https://api.rishipath.com \
  NODE_ENV=production \
  npm run build
  echo "  ✓ Build complete"
else
  echo "  → Skipping build (--skip-build flag set)"
  [ -d ".output" ] || { echo "ERROR: .output/ not found. Run without --skip-build first."; exit 1; }
fi

# ── 2. Rsync output to server ─────────────────────────────────
echo "▶ Uploading to rishipath.com..."

# Sync .output/ directory
rsync -az --progress --delete \
  -e "ssh $SSH_OPTS" \
  ./.output/ "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/.output/"

# Sync server.js and package.json
rsync -az \
  -e "ssh $SSH_OPTS" \
  ./server.js ./package.json \
  "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/"

# Sync public/ assets (logos, favicon, etc.)
rsync -az --progress \
  --exclude='*.DS_Store' \
  -e "ssh $SSH_OPTS" \
  ./public/ "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/public/"

echo "  ✓ Files uploaded"

# ── 3. Restart Node.js app via cloudlinux-selector ───────────
echo "▶ Restarting Node.js app..."
ssh $SSH_OPTS "${REMOTE_USER}@${REMOTE_HOST}" bash << 'REMOTE'
set -e
echo "  → Installing/updating npm packages..."
source ~/nodevenv/public_applications/20/bin/activate
cd ~/public_applications

# Install production deps only (server.js imports from .output so minimal)
npm install --omit=dev --no-audit 2>&1 | tail -3

echo "  → Restarting via cloudlinux-selector..."
/usr/sbin/cloudlinux-selector restart --json --interpreter nodejs \
  --app-root public_applications 2>&1 || \
  /usr/sbin/cloudlinux-selector stop --json --interpreter nodejs \
  --app-root public_applications 2>&1; \
  sleep 2; \
  /usr/sbin/cloudlinux-selector start --json --interpreter nodejs \
  --app-root public_applications 2>&1

echo "✓ Node.js app restarted"
REMOTE

echo "✅ rishipath.com deployed successfully"
