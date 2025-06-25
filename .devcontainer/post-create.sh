#!/bin/bash
set -e

echo "Setting up development environment..."

# Initialize firewall
echo "Initializing firewall..."
sudo /usr/local/bin/init-firewall.sh

# Configure Claude permissions
echo "Configuring Claude permissions..."
cat > ~/.claude/settings.json << 'EOF'
{
  "permissions": {
    "defaultMode": "bypassPermissions",
    "allow": [],
    "deny": []
  }
}
EOF

# Install MCP servers
echo "Installing MCP servers..."
claude mcp add sequential-thinking -- npx @modelcontextprotocol/server-sequential-thinking
claude mcp add context7 -- npx -y @upstash/context7-mcp
claude mcp add memory -- npx -y @modelcontextprotocol/server-memory

echo "Post-create setup complete!"