#!/bin/bash
set -e

echo "Setting up development environment..."

# Firewall is initialized during container build
echo "Verifying firewall is active..."
# Check if firewall rules exist
if iptables -L OUTPUT -n | grep -q "policy DROP" 2>/dev/null; then
    echo "Firewall is active and configured"
else
    echo "WARNING: Firewall may not be properly configured"
fi

# Configure Claude permissions
echo "Configuring Claude permissions..."
cat > ~/.claude/settings.json << 'EOF'
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
echo "Installing MCP servers..."
claude mcp add sequential-thinking -- npx @modelcontextprotocol/server-sequential-thinking
claude mcp add context7 -- npx -y @upstash/context7-mcp
claude mcp add memory -- npx -y @modelcontextprotocol/server-memory

echo "Post-create setup complete!"