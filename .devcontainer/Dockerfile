FROM ubuntu:24.04

ARG TZ
ARG USERNAME=ubuntu

ENV TZ="$TZ"

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    file \
    git \
    ca-certificates \
    openssl \
    procps \
    nodejs \
    npm \
    jq \
    locales \
    sudo \
    iptables \
    ipset \
    dnsutils \
    aggregate \
    gh \
    gnupg2 \
    unzip \
    iproute2 \
    fzf \
    wget \
    vim \
    && rm -rf /var/lib/apt/lists/*

# Generate and set locale
RUN locale-gen en_US.UTF-8
ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US:en
ENV LC_ALL=en_US.UTF-8

ENV DEVCONTAINER=true

# Persist bash history.
RUN SNIPPET="export PROMPT_COMMAND='history -a' && export HISTFILE=/commandhistory/.bash_history" \
  && mkdir /commandhistory \
  && touch /commandhistory/.bash_history \
  && chown -R $USERNAME /commandhistory

# Create workspace and config directories and set permissions
RUN mkdir -p /workspace /home/$USERNAME/.claude && \
  chown -R $USERNAME:$USERNAME /workspace /home/$USERNAME/.claude

WORKDIR /workspace

# Install global packages as root first
ENV NPM_CONFIG_PREFIX=/usr/local/share/npm-global
ENV PATH=$PATH:/usr/local/share/npm-global/bin

# Set the default shell to bash
ENV SHELL=/bin/bash

# Create the linuxbrew directory structure as root and set ownership
RUN mkdir -p /home/linuxbrew/.linuxbrew && \
    chown -R $USERNAME:$USERNAME /home/linuxbrew

# Create npm global directory and set ownership
RUN mkdir -p /usr/local/share/npm-global && \
    chown -R $USERNAME:$USERNAME /usr/local/share/npm-global

# Set up non-root user
USER $USERNAME

# Install Homebrew as non-root user
RUN NONINTERACTIVE=1 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Rust for the user
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | bash -s -- -y

# Install asdf binary (Go version) and configure
RUN mkdir -p ~/.local/bin && \
    wget -q https://github.com/asdf-vm/asdf/releases/download/v0.18.0/asdf-v0.18.0-linux-amd64.tar.gz && \
    tar -xzf asdf-v0.18.0-linux-amd64.tar.gz -C ~/.local/bin/ && \
    chmod +x ~/.local/bin/asdf && \
    rm asdf-v0.18.0-linux-amd64.tar.gz

# Install and configure asdf tools
RUN export PATH="$HOME/.local/bin:$PATH" && \
    mkdir -p ~/.config/asdf && \
    asdf plugin add dojo && \
    asdf install dojo 1.5.0 && \
    asdf install dojo 1.5.1 && \
    asdf plugin add scarb && \
    asdf install scarb 2.10.1 && \
    asdf plugin add starknet-foundry && \
    asdf install starknet-foundry 0.45.0 && \
    asdf plugin add cairo-coverage && \
    asdf install cairo-coverage 0.5.0

RUN curl -sL https://raw.githubusercontent.com/software-mansion/universal-sierra-compiler/master/scripts/install.sh | sh

# Install Claude (MCP servers configured in postCreateCommand)
RUN npm install -g @anthropic-ai/claude-code

# Install Starkli for Starknet CLI
RUN curl -sL https://get.starkli.sh | sh && /home/ubuntu/.starkli/bin/starkliup

# pre-approve all commands for claude (full yolo)
RUN echo '{"permissions": {"defaultMode": "bypassPermissions", "allow": [], "deny": []}}' > ~/.claude/settings.json

# Switch to root for final setup
USER root

# Copy and set up firewall script
COPY init-firewall.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/init-firewall.sh && \
  mkdir -p /etc/sudoers.d && \
  echo "$USERNAME ALL=(root) NOPASSWD: /usr/local/bin/init-firewall.sh" > /etc/sudoers.d/$USERNAME-firewall && \
  chmod 0440 /etc/sudoers.d/$USERNAME-firewall

# Switch back to user
USER $USERNAME

# Set up asdf environment and reshim tools
RUN ~/.local/bin/asdf reshim
ENV PATH="/home/$USERNAME/.local/bin:/home/$USERNAME/.asdf/shims:/home/$USERNAME/.cargo/bin:$PATH"
ENV ASDF_DATA_DIR="/home/$USERNAME/.asdf"
