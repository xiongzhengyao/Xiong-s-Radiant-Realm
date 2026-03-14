#!/usr/bin/env bash
set -euo pipefail

# Required env vars:
# - DEPLOY_HOST
# - DEPLOY_USER
# - DEPLOY_PATH
#
# Optional env vars:
# - DEPLOY_PORT (default: 22)
# - DEPLOY_BRANCH (default: main)
# - DEPLOY_APP_NAME (default: xiong-radiant-realm)
# - DEPLOY_APP_PORT (default: 8888)

if [[ -f ".env.deploy" ]]; then
  set -a
  # shellcheck disable=SC1091
  source ".env.deploy"
  set +a
fi

require_env() {
  local name="$1"
  if [[ -z "${!name:-}" ]]; then
    echo "Missing required env: ${name}" >&2
    exit 1
  fi
}

require_env "DEPLOY_HOST"
require_env "DEPLOY_USER"
require_env "DEPLOY_PATH"

DEPLOY_PORT="${DEPLOY_PORT:-22}"
DEPLOY_BRANCH="${DEPLOY_BRANCH:-main}"
DEPLOY_APP_NAME="${DEPLOY_APP_NAME:-xiong-radiant-realm}"
DEPLOY_APP_PORT="${DEPLOY_APP_PORT:-8888}"

REMOTE="${DEPLOY_USER}@${DEPLOY_HOST}"

echo "==> Deploying to ${REMOTE}:${DEPLOY_PATH} (branch: ${DEPLOY_BRANCH})"

ssh -p "${DEPLOY_PORT}" "${REMOTE}" \
  "DEPLOY_PATH='${DEPLOY_PATH}' DEPLOY_BRANCH='${DEPLOY_BRANCH}' DEPLOY_APP_NAME='${DEPLOY_APP_NAME}' DEPLOY_APP_PORT='${DEPLOY_APP_PORT}' bash -s" <<'EOF'
set -euo pipefail

echo "==> [remote] Start deploy: $(date)"

if [[ ! -d "${DEPLOY_PATH}" ]]; then
  echo "Deploy path not found: ${DEPLOY_PATH}" >&2
  exit 1
fi

cd "${DEPLOY_PATH}"

if [[ ! -d ".git" ]]; then
  echo "Not a git repository: ${DEPLOY_PATH}" >&2
  exit 1
fi

echo "==> [remote] Pull latest code"
git fetch origin "${DEPLOY_BRANCH}"
git checkout "${DEPLOY_BRANCH}"
git pull --ff-only origin "${DEPLOY_BRANCH}"

echo "==> [remote] Install dependencies"
npm ci

echo "==> [remote] Build"
npm run build

if command -v pm2 >/dev/null 2>&1; then
  echo "==> [remote] Restart with PM2"
  PM2_APP_NAME="${DEPLOY_APP_NAME}" PORT="${DEPLOY_APP_PORT}" HOST="0.0.0.0" NODE_ENV="production" \
    pm2 startOrReload ecosystem.config.cjs --update-env
  pm2 save >/dev/null 2>&1 || true
else
  echo "PM2 is not installed on server. Install once with: npm i -g pm2" >&2
  exit 1
fi

echo "==> [remote] Health check"
for i in 1 2 3 4 5; do
  if curl -fsS "http://127.0.0.1:${DEPLOY_APP_PORT}/health" >/dev/null; then
    echo "Health check OK"
    break
  fi

  if [[ "$i" -eq 5 ]]; then
    echo "Health check failed after retries" >&2
    exit 1
  fi

  sleep 2
done

echo "==> [remote] Deploy completed successfully: $(date)"
EOF

echo "==> Done"
