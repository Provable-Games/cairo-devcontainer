#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

# Simple firewall script for build-time initialization
# No refresh support - IPs are resolved once at build time

readonly ALLOWED_DOMAINS_FILE="/etc/allowed-domains.conf"

# Simple logging
log() {
    echo "[FIREWALL] $*"
}

error() {
    echo "[FIREWALL] ERROR: $*" >&2
    exit 1
}

# Verify running as root
[[ $EUID -eq 0 ]] || error "This script must be run as root"

# Verify allowed domains file exists
[[ -f "$ALLOWED_DOMAINS_FILE" ]] || error "Allowed domains file not found at $ALLOWED_DOMAINS_FILE"

# Verify required dependencies
command -v iptables >/dev/null 2>&1 || error "iptables is required but not installed"
command -v ipset >/dev/null 2>&1 || error "ipset is required but not installed"
command -v curl >/dev/null 2>&1 || error "curl is required but not installed"
command -v jq >/dev/null 2>&1 || error "jq is required but not installed"
command -v dig >/dev/null 2>&1 || error "dig is required but not installed"
command -v grep >/dev/null 2>&1 || error "grep is required but not installed"
command -v awk >/dev/null 2>&1 || error "awk is required but not installed"

log "Initializing firewall rules..."

# Flush existing rules
iptables -F
iptables -X
iptables -t nat -F
iptables -t nat -X
iptables -t mangle -F
iptables -t mangle -X

# Clean up any existing ipsets
ipset list -n 2>/dev/null | xargs -r -n1 ipset destroy 2>/dev/null || true

# Create ipset for allowed domains (no timeout - permanent entries)
ipset create allowed-domains hash:net maxelem 65536

# Essential rules
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT
iptables -A OUTPUT -p udp --dport 53 -j ACCEPT
iptables -A INPUT -p udp --sport 53 -j ACCEPT

# Fetch GitHub IPs
log "Fetching GitHub IP ranges..."
gh_ranges=$(curl -s --connect-timeout 5 https://api.github.com/meta) || error "Failed to fetch GitHub IPs"

echo "$gh_ranges" | jq -r '(.web + .api + .git)[]' | while read -r cidr; do
    # Validate CIDR format and range
    if [[ "$cidr" =~ ^([0-9]{1,3}\.){3}[0-9]{1,3}/[0-9]{1,2}$ ]]; then
        # Extract IP and prefix
        ip="${cidr%/*}"
        prefix="${cidr#*/}"
        
        # Validate IP octets
        valid_ip=true
        IFS='.' read -ra octets <<< "$ip"
        for octet in "${octets[@]}"; do
            if (( octet > 255 )); then
                valid_ip=false
                break
            fi
        done
        
        # Validate prefix
        if [[ "$valid_ip" == true ]] && (( prefix >= 0 && prefix <= 32 )); then
            ipset add allowed-domains "$cidr" -exist
        else
            log "WARNING: Invalid CIDR range from GitHub: $cidr"
        fi
    fi
done

# Resolve allowed domains
log "Resolving allowed domains..."
while IFS= read -r domain; do
    [[ -z "$domain" || "$domain" =~ ^# ]] && continue
    
    ips=$(dig +short +time=5 A "$domain" 2>/dev/null | grep -E '^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$')
    if [[ -n "$ips" ]]; then
        while IFS= read -r ip; do
            ipset add allowed-domains "$ip" -exist
        done <<< "$ips"
        log "Added IPs for $domain"
    else
        log "WARNING: No IPs resolved for $domain"
    fi
done < "$ALLOWED_DOMAINS_FILE"

# Add common CDN ranges
ipset add allowed-domains "142.250.0.0/15" -exist  # Google
ipset add allowed-domains "172.217.0.0/16" -exist  # Google
ipset add allowed-domains "216.58.192.0/19" -exist # Google

# Allow Docker internal network
HOST_IP=$(ip route | grep default | awk '{print $3}')
if [[ -n "$HOST_IP" ]]; then
    HOST_NETWORK="${HOST_IP%.*}.0/24"
    log "Allowing Docker network: $HOST_NETWORK"
    iptables -A INPUT -s "$HOST_NETWORK" -j ACCEPT
    iptables -A OUTPUT -d "$HOST_NETWORK" -j ACCEPT
fi

# Connection tracking
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A OUTPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Allow traffic to allowed domains
iptables -A OUTPUT -m set --match-set allowed-domains dst -j ACCEPT

# Set default policies to DROP
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT DROP

log "Firewall initialization complete"

# Verification tests
log "Running firewall verification tests..."

# Negative test - should be blocked
if timeout 2 curl -s https://example.com >/dev/null 2>&1; then
    error "Firewall test failed - example.com is accessible (should be blocked)"
fi

# Positive test - should be allowed
if ! timeout 5 curl -s https://api.github.com/zen >/dev/null 2>&1; then
    error "Firewall test failed - api.github.com is not accessible (should be allowed)"
fi

log "Firewall verified - all tests passed"