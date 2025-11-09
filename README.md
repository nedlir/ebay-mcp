# eBay API MCP Server

Model Context Protocol (MCP) server for eBay Sell APIs. Provides AI assistants with access to eBay's seller functionality including inventory management, order fulfillment, marketing campaigns, and account configuration.

## Features

This MCP server provides comprehensive access to eBay Sell APIs:

### Core Selling APIs
- **Account Management**: Configure seller policies, payment/return/fulfillment policies
- **Inventory Management**: Create and manage inventory items and offers
- **Order Management**: Process orders, create shipping fulfillments, issue refunds
- **Marketing**: Manage marketing campaigns and promotions
- **Analytics**: Access sales and traffic reports, seller standards profiles

### Supporting APIs
- **Metadata & Taxonomy**: Access marketplace policies and category hierarchies
- **Recommendation**: Get listing improvement recommendations
- **Communication**: Handle buyer messages, negotiations, notifications, and feedback
- **Compliance**: Check listing violations and regulatory compliance
- **Identity**: User verification and authentication
- **Translation**: Multi-language listing support
- **VERO**: Intellectual property protection
- **eDelivery**: International shipping quotes

## Prerequisites

- **Node.js 18 or higher**
- **eBay Developer account** with API credentials
- **Application keys** from [eBay Developer Portal](https://developer.ebay.com/my/keys)

## Quick Start

### 1. Installation

```bash
# Clone the repository
git clone <repository-url>
cd ebay-api-mcp-server

# Install dependencies
npm install

# Build the project
npm run build
```

### 2. Configuration

Create a `.env` file with your eBay API credentials:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
EBAY_CLIENT_ID=your_client_id_here
EBAY_CLIENT_SECRET=your_client_secret_here
EBAY_ENVIRONMENT=sandbox  # or 'production'
```

Get your credentials from the [eBay Developer Portal](https://developer.ebay.com/my/keys)

### 3. Test the Server

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

## Integration with AI Models

### Using with Claude Desktop (Recommended)

Claude Desktop provides native MCP support for seamless integration.

**Configuration File Location:**
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

**Add to your config:**

```json
{
  "mcpServers": {
    "ebay": {
      "command": "node",
      "args": ["/absolute/path/to/ebay-api-mcp-server/build/index.js"],
      "env": {
        "EBAY_CLIENT_ID": "your_client_id",
        "EBAY_CLIENT_SECRET": "your_client_secret",
        "EBAY_ENVIRONMENT": "sandbox"
      }
    }
  }
}
```

**Usage:**
- Restart Claude Desktop after configuration
- The eBay API tools will be automatically available
- Use natural language to interact with eBay APIs:
  - "List all my inventory items"
  - "Get orders from the last 7 days"
  - "Create a new fulfillment policy"
  - "Get traffic report for my listings"

### Using with Claude Code

Claude Code (claude.ai/code) supports MCP servers for enhanced capabilities.

**Setup:**

```bash
# Ensure the server is built
npm run build

# Add to Claude Code MCP configuration
# The configuration file is typically at:
# macOS: ~/Library/Application Support/Claude/claude_code_config.json
```

**Configuration:**

```json
{
  "mcpServers": {
    "ebay": {
      "command": "node",
      "args": ["/absolute/path/to/ebay-api-mcp-server/build/index.js"],
      "env": {
        "EBAY_CLIENT_ID": "your_client_id",
        "EBAY_CLIENT_SECRET": "your_client_secret",
        "EBAY_ENVIRONMENT": "sandbox"
      }
    }
  }
}
```

**Best Practices:**
1. **Start with Sandbox**: Always test with `EBAY_ENVIRONMENT=sandbox` first
2. **Use Specific Queries**: Be explicit about what data you need
3. **Verify Credentials**: Ensure your eBay app has the required OAuth scopes
4. **Monitor Rate Limits**: eBay APIs have rate limits; Claude will handle errors gracefully

### Using with Other MCP-Compatible AI Models

This server follows the standard MCP protocol and works with any MCP-compatible client.

**Generic MCP Client Integration:**

```javascript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const transport = new StdioClientTransport({
  command: 'node',
  args: ['/path/to/ebay-api-mcp-server/build/index.js'],
  env: {
    EBAY_CLIENT_ID: 'your_client_id',
    EBAY_CLIENT_SECRET: 'your_client_secret',
    EBAY_ENVIRONMENT: 'sandbox'
  }
});

const client = new Client({
  name: 'ebay-client',
  version: '1.0.0'
}, {
  capabilities: {}
});

await client.connect(transport);

// List available tools
const tools = await client.request({
  method: 'tools/list'
}, { method: 'tools/list' });

// Execute a tool
const result = await client.request({
  method: 'tools/call',
  params: {
    name: 'ebay_get_inventory_items',
    arguments: { limit: 10 }
  }
}, { method: 'tools/call' });
```

### Using Programmatically (Node.js)

You can also use the API client directly without MCP:

```javascript
import { EbaySellerApi } from './build/api/index.js';
import { getEbayConfig } from './build/config/environment.js';

const config = getEbayConfig();
const api = new EbaySellerApi(config);

// Get inventory items
const items = await api.inventory.getInventoryItems(10, 0);

// Get orders
const orders = await api.fulfillment.getOrders();

// Get analytics
const traffic = await api.analytics.getTrafficReport(
  'LISTING',
  'lastWeek',
  'CLICK_THROUGH_RATE,IMPRESSION'
);
```

## Available Tools (50+ MCP Tools)

### Account Management (4 tools)
- `ebay_get_custom_policies` - Retrieve custom policies
- `ebay_get_fulfillment_policies` - Get fulfillment policies
- `ebay_get_payment_policies` - Get payment policies
- `ebay_get_return_policies` - Get return policies

### Inventory Management (6 tools)
- `ebay_get_inventory_items` - List all inventory items
- `ebay_get_inventory_item` - Get specific inventory item by SKU
- `ebay_create_inventory_item` - Create or update inventory item
- `ebay_get_offers` - List offers
- `ebay_create_offer` - Create a new offer
- `ebay_publish_offer` - Publish offer to create listing

### Order Management (3 tools)
- `ebay_get_orders` - Get orders with optional filters
- `ebay_get_order` - Get specific order details
- `ebay_create_shipping_fulfillment` - Create shipping fulfillment

### Marketing & Promotions (3 tools)
- `ebay_get_campaigns` - Get marketing campaigns
- `ebay_get_promotions` - Get promotions
- `ebay_find_listing_recommendations` - Get listing recommendations

### Analytics (4 tools)
- `ebay_get_traffic_report` - Get traffic analytics
- `ebay_find_seller_standards_profiles` - Get all seller standards
- `ebay_get_seller_standards_profile` - Get specific seller standard
- `ebay_get_customer_service_metric` - Get customer service metrics

### Metadata & Taxonomy (6 tools)
- `ebay_get_category_policies` - Get category policies
- `ebay_get_item_condition_policies` - Get item condition policies
- `ebay_get_default_category_tree_id` - Get default category tree
- `ebay_get_category_tree` - Get category tree structure
- `ebay_get_category_suggestions` - Get category suggestions
- `ebay_get_item_aspects_for_category` - Get item aspects

### Communication (11 tools)
- `ebay_get_offers_to_buyers` - Get Best Offers
- `ebay_send_offer_to_interested_buyers` - Send offers to buyers
- `ebay_search_messages` - Search buyer-seller messages
- `ebay_get_message` - Get specific message
- `ebay_reply_to_message` - Reply to buyer message
- `ebay_get_notification_config` - Get notification settings
- `ebay_update_notification_config` - Update notifications
- `ebay_create_notification_destination` - Create notification endpoint
- `ebay_get_feedback` - Get transaction feedback
- `ebay_leave_feedback_for_buyer` - Leave buyer feedback
- `ebay_get_feedback_summary` - Get feedback summary

### Other APIs (10 tools)
- `ebay_get_user` - Get user identity
- `ebay_get_listing_violations` - Get compliance violations
- `ebay_get_listing_violations_summary` - Get violation summary
- `ebay_suppress_violation` - Suppress a violation
- `ebay_report_infringement` - Report IP infringement
- `ebay_get_reported_items` - Get reported items
- `ebay_translate` - Translate listing text
- `ebay_create_shipping_quote` - Get shipping quote
- `ebay_get_shipping_quote` - Retrieve shipping quote

## Development

```bash
# Type check
npm run typecheck

# Watch mode for development
npm run watch

# Clean build artifacts
npm run clean

# Rebuild
npm run build
```

## Project Structure

```
src/
├── api/                          # eBay API client implementations
│   ├── account-management/       # Account API handlers
│   ├── analytics-and-report/     # Analytics API handlers
│   ├── communication/            # Message, Negotiation, Feedback, Notification
│   ├── listing-management/       # Inventory API handlers
│   ├── listing-metadata/         # Metadata and Taxonomy APIs
│   ├── marketing-and-promotions/ # Marketing and Recommendation APIs
│   ├── order-management/         # Fulfillment API handlers
│   ├── other/                    # Identity, Compliance, VERO, Translation, eDelivery
│   ├── client.ts                 # Base HTTP client with OAuth
│   └── index.ts                  # Main API facade
├── auth/                         # OAuth authentication
│   └── oauth.ts                  # eBay OAuth 2.0 client
├── config/                       # Configuration management
│   └── environment.ts            # Environment variable handling
├── tools/                        # MCP tool definitions
│   ├── tool-definitions.ts       # Tool schemas by category
│   └── index.ts                  # Tool execution logic
├── types/                        # TypeScript type definitions
│   └── ebay.ts                   # eBay API types
└── index.ts                      # MCP server entrypoint
```

## Authentication

The server uses **eBay's OAuth 2.0 Client Credentials flow**:
- Access tokens are automatically managed and refreshed
- Tokens are cached with 60-second safety buffer before expiry
- All API requests automatically include valid authentication

## Error Handling

The server provides detailed error messages for:
- **Authentication failures**: Invalid credentials or expired tokens
- **API request errors**: eBay API validation errors with specific messages
- **Invalid parameters**: Missing or incorrect tool arguments
- **Network issues**: Connection timeouts and network errors

Errors are returned in MCP-compatible format for proper handling by AI clients.

## Best Practices

### 1. **Start with Sandbox Environment**
Always test with sandbox credentials before using production:
```env
EBAY_ENVIRONMENT=sandbox
```

### 2. **Use Appropriate OAuth Scopes**
Ensure your eBay application has the required scopes:
- `https://api.ebay.com/oauth/api_scope` - Basic API access
- `https://api.ebay.com/oauth/api_scope/sell.account` - Account management
- `https://api.ebay.com/oauth/api_scope/sell.inventory` - Inventory operations
- Additional scopes as needed for your use case

### 3. **Handle Rate Limits**
eBay enforces rate limits:
- **Default**: 5,000 calls/day per application
- **Burst**: Up to 10 calls/second
- The client will return rate limit errors; implement retry logic if needed

### 4. **Secure Credential Storage**
- Never commit `.env` file to version control
- Use environment variables in production
- Rotate credentials regularly
- Use separate credentials for sandbox and production

### 5. **Monitor API Usage**
- Check the [eBay Developer Portal](https://developer.ebay.com/my/api_dashboard) regularly
- Monitor for deprecation notices
- Review API call logs for errors

## Troubleshooting

### Server won't start
```bash
# Check Node version (must be 18+)
node --version

# Rebuild the project
npm run clean && npm run build

# Check for TypeScript errors
npm run typecheck
```

### Authentication errors
```bash
# Verify credentials are set
echo $EBAY_CLIENT_ID
echo $EBAY_CLIENT_SECRET

# Check environment setting
echo $EBAY_ENVIRONMENT  # Should be 'sandbox' or 'production'

# Test credentials at eBay Developer Portal
# https://developer.ebay.com/my/keys
```

### MCP connection issues
- Ensure absolute paths are used in MCP config
- Restart the AI client after config changes
- Check server logs for error messages
- Verify the build directory exists and contains compiled JS files

## Resources

- **eBay Developer Program**: https://developer.ebay.com/
- **eBay API Documentation**: https://developer.ebay.com/docs
- **Model Context Protocol**: https://modelcontextprotocol.io/
- **MCP Specification**: https://spec.modelcontextprotocol.io/
- **eBay Sandbox**: https://developer.ebay.com/sandbox

## Contributing

Contributions are welcome! Please ensure:
- All API implementations match OpenAPI specifications in `docs/` folder
- TypeScript strict mode compliance
- Proper error handling
- Tool definitions follow MCP specification

## License

MIT

## Support

For issues related to:
- **This MCP server**: Open an issue in this repository
- **eBay APIs**: Visit [eBay Developer Forums](https://community.ebay.com/t5/Developer-Forums/ct-p/devforums)
- **MCP Protocol**: Visit [MCP Documentation](https://modelcontextprotocol.io/docs)
