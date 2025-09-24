#!/bin/bash

echo "Installing Twitter Ads node to Docker n8n..."

# Build the node first
echo "Building node..."
npm install
npm run build

# Check if build succeeded
if [ ! -d "dist" ]; then
    echo "Build failed! Check for errors above."
    exit 1
fi

# Copy entire package to container
echo "Copying files to n8n container..."
docker exec -u root n8n mkdir -p /home/node/.n8n/nodes
docker cp ../fixed-node n8n:/home/node/.n8n/nodes/n8n-nodes-twitter-ads

# Fix permissions
echo "Setting permissions..."
docker exec -u root n8n chown -R node:node /home/node/.n8n/nodes/n8n-nodes-twitter-ads

# Restart n8n
echo "Restarting n8n..."
docker restart n8n

echo "Installation complete!"
echo "Waiting for n8n to restart..."
sleep 10

# Check if node loaded
echo "Checking if node loaded..."
docker logs n8n --tail 50 | grep -i "twitter" || echo "Node may not have loaded. Check full logs with: docker logs n8n"

echo ""
echo "To verify installation:"
echo "1. Go to https://n8n.provable.games"
echo "2. Create a new workflow"
echo "3. Search for 'Twitter Ads' when adding a node"
echo ""
echo "If the node doesn't appear, check logs with:"
echo "docker logs n8n --tail 100"