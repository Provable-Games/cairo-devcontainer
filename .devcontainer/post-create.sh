#!/bin/bash
set -e

echo "Setting up development environment..."

# Firewall is initialized during container build
echo "Verifying firewall is active..."

# Check if we can run iptables (might need different approach without sudo)
if command -v iptables >/dev/null 2>&1; then
    # Try to check firewall status
    if iptables -L OUTPUT -n 2>/dev/null | grep -q "policy DROP"; then
        echo "✓ Firewall is active and configured"
        
        # Additional verification - check if ipset exists
        if ipset list allowed-domains -n 2>/dev/null >/dev/null; then
            echo "✓ Allowed domains ipset is configured"
        else
            echo "⚠ Allowed domains ipset not found"
        fi
        
        # Test connectivity to allowed domain
        if timeout 2 curl -s https://api.github.com/zen >/dev/null 2>&1; then
            echo "✓ Connectivity to allowed domains working"
        else
            echo "⚠ Cannot reach allowed domains (network issue?)"
        fi
        
        # Test that blocked domains are actually blocked
        if ! timeout 2 curl -s https://example.com >/dev/null 2>&1; then
            echo "✓ Firewall is blocking unauthorized domains"
        else
            echo "⚠ Firewall may not be blocking properly"
        fi
    else
        echo "⚠ Firewall rules not detected - this is expected without root access"
        echo "  The firewall should still be active from the build phase"
    fi
else
    echo "⚠ Cannot verify firewall status - iptables not accessible"
    echo "  This is normal for non-root users"
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