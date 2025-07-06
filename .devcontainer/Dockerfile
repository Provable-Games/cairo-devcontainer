FROM ubuntu:24.04

ARG TZ
ARG USERNAME=ubuntu

ENV TZ="$TZ"
ENV DEBIAN_FRONTEND=noninteractive

# Combine apt operations and clean in single layer
RUN apt-get update && apt-get install -y --no-install-recommends \
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
    && locale-gen en_US.UTF-8 \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Set locale environment
ENV LANG=en_US.UTF-8 LANGUAGE=en_US:en LC_ALL=en_US.UTF-8
ENV DEVCONTAINER=true SHELL=/bin/bash

# Create all directories and set permissions in one layer
RUN mkdir -p /commandhistory /workspace /home/$USERNAME/.claude \
    /home/linuxbrew/.linuxbrew /usr/local/share/npm-global \
    && touch /commandhistory/.bash_history \
    && chown -R $USERNAME:$USERNAME /commandhistory /workspace \
    /home/$USERNAME/.claude /home/linuxbrew /usr/local/share/npm-global

# Configure bash history
RUN echo "export PROMPT_COMMAND='history -a' && export HISTFILE=/commandhistory/.bash_history" \
    >> /home/$USERNAME/.bashrc

WORKDIR /workspace

# Set environment for npm
ENV NPM_CONFIG_PREFIX=/usr/local/share/npm-global
ENV PATH=$PATH:/usr/local/share/npm-global/bin

# Configure PATH early for asdf
ENV PATH="/home/$USERNAME/.local/bin:/home/$USERNAME/.asdf/shims:/home/$USERNAME/.cargo/bin:$PATH"
ENV ASDF_DATA_DIR="/home/$USERNAME/.asdf"

# Switch to non-root user for remaining operations
USER $USERNAME

# Install development tools in parallel where possible
RUN NONINTERACTIVE=1 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" & \
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | bash -s -- -y & \
    wait

# Install asdf and tools
RUN mkdir -p ~/.local/bin && \
    wget -q https://github.com/asdf-vm/asdf/releases/download/v0.18.0/asdf-v0.18.0-linux-amd64.tar.gz && \
    tar -xzf asdf-v0.18.0-linux-amd64.tar.gz -C ~/.local/bin/ && \
    chmod +x ~/.local/bin/asdf && \
    rm asdf-v0.18.0-linux-amd64.tar.gz

# Install asdf plugins and tools (combine related operations)
RUN export PATH="$HOME/.local/bin:$PATH" && \
    mkdir -p ~/.config/asdf && \
    asdf plugin add dojo && \
    asdf plugin add scarb && \
    asdf plugin add starknet-foundry && \
    asdf plugin add cairo-coverage && \
    asdf install dojo 1.5.0 && \
    asdf install dojo 1.5.1 && \
    asdf install scarb 2.10.1 && \
    asdf install starknet-foundry 0.45.0 && \
    asdf install cairo-coverage 0.5.0 && \
    ~/.local/bin/asdf reshim

# Install remaining tools
RUN curl -L https://raw.githubusercontent.com/software-mansion/universal-sierra-compiler/master/scripts/install.sh | sh && \
    npm install -g @anthropic-ai/claude-code && \
    curl https://get.starkli.sh | sh && /home/ubuntu/.starkli/bin/starkliup

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

CMD ["/bin/bash"]