# n8n Twitter Ads Node

Custom n8n node for Twitter/X Ads API integration with advanced follower targeting capabilities.

## Features

- **Campaign Management**: Create and manage advertising campaigns
- **Follower Targeting**: Target followers of specific Twitter accounts
- **Performance Analytics**: Track CTR, clicks, impressions, and conversions
- **Line Item Management**: Configure budgets and objectives
- **Modular Architecture**: Works with AI nodes for optimization

## Installation

### Prerequisites
- n8n instance (Docker or self-hosted)
- Twitter Ads API access
- Node.js 16+ (for building)

### Quick Install (Docker)

```bash
# Clone this repository
git clone [your-repo-url]
cd n8n-twitter-ads

# Build and install to your Docker n8n
./install-to-docker.sh
```

### Manual Installation

```bash
# Build the node
npm install
npm run build

# Copy to n8n container
docker exec -u root n8n mkdir -p /home/node/.n8n/nodes
docker cp $(pwd) n8n:/home/node/.n8n/nodes/n8n-nodes-twitter-ads
docker exec -u root n8n chown -R node:node /home/node/.n8n/nodes

# Restart n8n
docker restart n8n
```

## Setup

1. **Get Twitter Ads API Access**
   - Apply at https://developer.twitter.com/en/products/ads-api
   - Create an app to get API keys
   - Find your Ads Account ID

2. **Configure Credentials in n8n**
   - Go to Credentials → New → Twitter Ads API
   - Enter your API keys and Account ID

3. **Import Example Workflows**
   - Find examples in `workflow-examples/`
   - Start with `1-simple-campaign.json`

## Node Operations

### Campaign
- Create, update, get campaigns
- Set daily budgets and schedules

### Line Item
- Create ad groups with objectives
- Configure bidding strategies

### Targeting
- **Follower Targeting**: Target users who follow specific accounts
- Supports "Similar to Followers" targeting

### Analytics
- Get performance metrics (CTR, CPC, impressions)
- Track campaign and line item stats

## Workflow Examples

1. **Simple Campaign**: Basic campaign creation
2. **Follower Targeting**: Target competitor followers
3. **Performance Monitoring**: Track metrics every 6 hours

See `workflow-examples/` for importable JSON files.

## Architecture

This node follows a modular approach:
- Twitter Ads node handles API operations
- AI decisions come from OpenAI/Claude nodes
- Analytics from Google Analytics nodes
- Logic lives in Function nodes

## Docker Compose

The included `docker-compose.yml` is configured for n8n with:
- Custom nodes support
- SSL/proxy integration
- Basic authentication

## Support

For issues or questions:
- Check n8n logs: `docker logs n8n`
- Verify node loaded: Search for "Twitter Ads" when adding nodes
- API documentation: https://developer.twitter.com/en/docs/ads/general/overview

## License

MIT