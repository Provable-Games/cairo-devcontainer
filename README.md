# Cairo Devcontainer

This repository provides a pre-configured development container for building Cairo applications, including support for Dojo framework development. The devcontainer creates an isolated, secure environment that's optimized for both human developers and AI agents.

## Overview

This devcontainer offers:
- **Complete Cairo Development Environment**: Pre-installed with Cairo, Dojo, Scarb, Starknet Foundry, and other essential tools
- **Agent-Safe Isolation**: Network and system isolation to enable secure AI agent assistance
- **Version Management**: Uses `asdf` for flexible tool version management across multiple projects
- **Cross-Platform Compatibility**: Works seamlessly with VS Code and Cursor on any platform

## Quick Start

### Prerequisites
- [Docker](https://www.docker.com/get-started) installed and running
- [VS Code](https://code.visualstudio.com/) or [Cursor](https://cursor.sh/) with the Dev Containers extension

### Setup Workflow

1. **Clone this repository** in VS Code/Cursor:
   ```bash
   git clone <this-repo-url>
   cd dojo-devcontainer
   ```

2. **Open in devcontainer**:
   - In VS Code: Press `Ctrl+Shift+P` → "Dev Containers: Reopen in Container"
   - In Cursor: Press `Ctrl+Shift+P` → "Dev Containers: Reopen in Container"

3. **Clone your Cairo/Dojo project** inside the devcontainer:
   ```bash
   # Navigate to workspace (you're already here)
   git clone <your-cairo-project-url>
   cd your-cairo-project
   ```

4. **Start developing** - all tools are ready to use!

## Pre-installed Tools

The devcontainer comes with the following tools pre-installed:

| Tool | Version | Purpose |
|------|---------|---------|
| Dojo | 1.5.0 | Dojo framework for onchain games |
| Scarb | 2.10.1 | Cairo package manager |
| Starknet Foundry | 0.45.0 | Testing and deployment toolkit |
| Cairo Coverage | 0.1.0 | Code coverage analysis |
| Universal Sierra Compiler | Latest | Sierra compilation |
| Claude CLI | Latest | AI assistance integration |

## Version Management with asdf

This devcontainer uses [asdf](https://asdf-vm.com/) for flexible version management, allowing you to work with multiple Cairo/Dojo projects that may require different tool versions.

### How it works:

1. **Default versions** are pre-installed as shown in the table above
2. **Project-specific versions** can be set using `.tool-versions` files in your project
3. **Automatic switching** happens when you navigate between projects

### Example .tool-versions file:
```
dojo 1.4.0
scarb 2.8.5
starknet-foundry 0.40.0
```

### Managing versions:
```bash
# List available versions
asdf list-all dojo

# Install a specific version
asdf install dojo 1.4.0

# Set version for current project
asdf local dojo 1.4.0

# Set global version
asdf global dojo 1.5.0
```

## Security Features

This devcontainer includes several security features that make it safe for AI agent usage:

- **Network isolation** via custom firewall rules
- **Containerized environment** prevents access to host system
- **Controlled tool access** with pre-defined development tools only
- **Isolated workspace** for project files

## Working with Multiple Projects

The beauty of this setup is that you can work on multiple Cairo/Dojo projects simultaneously:

```bash
# In the devcontainer workspace
git clone https://github.com/your-org/dojo-game-1
git clone https://github.com/your-org/cairo-lib-2
git clone https://github.com/your-org/starknet-contracts-3

# Each project can have its own .tool-versions
cd dojo-game-1      # Uses Dojo 1.5.0 (default)
cd cairo-lib-2      # Uses Cairo 2.8.0 (if .tool-versions exists)
cd starknet-contracts-3  # Uses Starknet Foundry 0.42.0 (if specified)
```

## Common Commands

```bash
# Build a Dojo project
dojo build

# Run Scarb commands
scarb build
scarb test

# Deploy with Starknet Foundry
snforge test
sncast deploy

# Check tool versions
dojo --version
scarb --version
snforge --version
```

## Troubleshooting

### Tool not found
If a tool isn't found, try reshimming asdf:
```bash
asdf reshim
```

### Version conflicts
Check your current versions:
```bash
asdf current
```

### Container issues
Rebuild the devcontainer:
- `Ctrl+Shift+P` → "Dev Containers: Rebuild Container"

## Contributing

If you need additional tools or different versions, feel free to:
1. Fork this repository
2. Modify the `Dockerfile` to include your tools
3. Update this README with the changes
4. Submit a pull request

## License

This devcontainer configuration is provided as-is for the Cairo development community. 
