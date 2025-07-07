# DevContainer Security Notes

## Claude Code Permissions

The Claude Code extension uses a permissions system to control what operations it can perform. This DevContainer configures Claude with secure defaults:

- **Default Mode**: `ask` - Claude will prompt for permission before performing sensitive operations
- **Allowed Operations**: None by default
- **Denied Operations**: None by default

### Changing Permission Mode

The settings can be modified in `.devcontainer/.claude/settings.json`. Available modes:

- `ask` (recommended): Prompts for each operation
- `bypassPermissions`: Allows all operations without prompting (NOT RECOMMENDED)
- Custom allow/deny lists can be configured

### Security Considerations

1. The `bypassPermissions` mode should only be used in isolated development environments
2. Always review operations before approving them in `ask` mode
3. Consider adding specific allowed operations rather than using bypass mode

## Firewall Configuration

The DevContainer includes a firewall that restricts network access to approved domains listed in `allowed-domains.conf`. This helps prevent:

- Accidental data exfiltration
- Malicious package installations
- Unauthorized network access

To add new domains, edit `.devcontainer/allowed-domains.conf` and rebuild the container.