#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

# Simple logging
log() {
    echo "[POST-CREATE] $*"
}

error() {
    echo "[POST-CREATE] ERROR: $*" >&2
    exit 1
}

log "Setting up development environment..."

# Initialize firewall
log "Initializing firewall..."
sudo /usr/local/bin/init-firewall.sh || error "Failed to initialize firewall"

# Configure Claude permissions
log "Configuring Claude permissions..."
cat > ~/.claude/settings.json << 'EOF' || error "Failed to configure Claude settings"
{
  "permissions": {
    "defaultMode": "bypassPermissions",
    "allow": [],
    "deny": []
  },
  "env": {
    "BASH_DEFAULT_TIMEOUT_MS": 3600000,
    "BASH_MAX_TIMEOUT_MS": 3600000
  }
}
EOF

# Install MCP servers
log "Installing MCP servers..."
claude mcp add sequential-thinking -- npx @modelcontextprotocol/server-sequential-thinking || log "WARNING: Failed to install sequential-thinking MCP server"
claude mcp add context7 -- npx -y @upstash/context7-mcp || log "WARNING: Failed to install context7 MCP server"
claude mcp add memory -- npx -y @modelcontextprotocol/server-memory || log "WARNING: Failed to install memory MCP server"

log "Post-create setup complete!"