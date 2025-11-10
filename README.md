# Last Modified: Monday, November 10, 2025

# eBay API MCP Server

Model Context Protocol (MCP) server for eBay Sell APIs. Provides AI assistants with access to eBay's seller functionality including inventory management, order fulfillment, marketing campaigns, and account configuration.

## Features

This MCP server provides comprehensive access to eBay Sell APIs:

- **Account Management**: Configure seller policies, payment/return/fulfillment policies
- **Inventory Management**: Create and manage inventory items and offers
- **Order Management**: Process orders, create shipping fulfillments, issue refunds
- **Marketing**: Manage marketing campaigns and promotions
- **Analytics**: Access sales and traffic reports, seller standards profiles
- **OAuth 2.1 Authorization**: Secure multi-user deployments with industry-standard OAuth
- **And more**: See the "Available Tools" section below for a complete list.

## Transport Modes

This server supports two operation modes:

1. **STDIO Transport** (default): For local desktop applications like Claude Desktop
2. **HTTP Transport with OAuth 2.1**: For remote, multi-user deployments with secure authorization

📚 **For OAuth setup instructions**, see [OAUTH-SETUP.md](./OAUTH-SETUP.md)

## Prerequisites

- **Node.js 18 or higher**
- **eBay Developer account** with API credentials from the [eBay Developer Portal](https://developer.ebay.com/my/keys)
- **(Optional) OAuth Authorization Server** for HTTP mode with authorization (e.g., Keycloak, Auth0, Okta)

## Installation

### Option 1: NPM Package (Recommended)

```bash
npm install -g ebay-api-mcp-server
```

### Option 2: From Source

```bash
# Clone the repository
git clone https://github.com/yourusername/ebay-api-mcp-server.git
cd ebay-api-mcp-server

# Install dependencies
npm install

# Build the project
npm run build
```

## Quick Start

### 1. Get eBay API Credentials

1. Create an eBay Developer account at [developer.ebay.com](https://developer.ebay.com/)
2. Create an application to get your Client ID and Client Secret
3. Choose between Sandbox (testing) or Production environment

### 2. Configuration

Create a `.env` file with your eBay API credentials:

```env
EBAY_CLIENT_ID=your_client_id_here
EBAY_CLIENT_SECRET=your_client_secret_here
EBAY_ENVIRONMENT=sandbox  # or 'production'
```

### Manual Token Configuration

For development and testing, you can also configure the server by manually creating a `.ebay-mcp-tokens.json` file in your home directory. This allows the server to use your OAuth tokens without requiring you to use the `ebay_set_user_tokens` tool.

You can use the `create_token_template_file` tool to generate a template file in the root of the project. Simply copy this file to your home directory and fill in the values.

For detailed instructions, see the [Manual Token Configuration guide](./docs/auth/manual-token-config.md).

### 3. Run the Server

#### STDIO Mode (Local Desktop)

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

The server will output "eBay API MCP Server running on stdio" to indicate it's ready.

### 4. Quick Start Example

Once the server is running, you can use it through any MCP-compatible AI assistant (like Claude Desktop). Here's a typical workflow:

**Example 1: List Your Inventory**
```
AI: Use ebay_get_inventory_items to retrieve all inventory items
Server Response: Returns array of inventory items with SKU, quantity, pricing
```

**Example 2: Create a New Listing**
```
AI: 1. Use ebay_create_inventory_item with SKU "WIDGET-001" and product details
    2. Use ebay_create_offer with pricing and policy IDs
    3. Use ebay_publish_offer to make it live on eBay
Server Response: Returns offer ID and listing URL
```

**Example 3: Process an Order**
```
AI: 1. Use ebay_get_orders to retrieve pending orders
    2. Use ebay_create_shipping_fulfillment with tracking number
Server Response: Returns fulfillment ID and shipping confirmation
```

For detailed usage of specific tools, see the "Available Tools" section below.

#### HTTP Mode with OAuth (Remote Multi-User)

See [OAUTH-SETUP.md](./OAUTH-SETUP.md) for detailed OAuth configuration instructions.

```bash
# Development mode
npm run dev:http

# Production mode
npm run build
npm run start:http
```

**Quick OAuth Test with Keycloak:**

```bash
# Terminal 1: Start Keycloak
docker run -p 127.0.0.1:8080:8080 \
  -e KC_BOOTSTRAP_ADMIN_USERNAME=admin \
  -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak start-dev

# Terminal 2: Configure .env and start server
cp .env.example .env
# Edit .env with your eBay and OAuth credentials
npm run dev:http
```

## Core Concepts

### What is MCP (Model Context Protocol)?

MCP is a standardized protocol that allows AI assistants to interact with external tools and services. This server implements MCP to give AI assistants access to eBay's seller APIs.

### Key Components

1. **MCP Server** - This application acts as a bridge between AI assistants and eBay APIs
2. **Tools** - Individual functions exposed to AI assistants (e.g., `ebay_get_orders`, `ebay_create_offer`)
3. **OAuth Authentication** - Secure token-based authentication for accessing eBay APIs
4. **Transport Modes** - Two ways to run the server:
   - **STDIO** (default): For local desktop use with apps like Claude Desktop
   - **HTTP with OAuth 2.1**: For remote, multi-user deployments

### How It Works

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│ AI Assistant│ ◄──────►│  MCP Server  │ ◄──────►│  eBay API   │
│  (Claude)   │   MCP   │  (This app)  │  OAuth  │             │
└─────────────┘         └──────────────┘         └─────────────┘
```

1. AI assistant sends MCP tool requests (e.g., "get my orders")
2. MCP server validates and forwards requests to eBay APIs
3. eBay processes the request and returns data
4. MCP server formats the response for the AI assistant
5. AI assistant uses the data to help you

### Authentication Flow

This server supports two authentication modes:

**User Tokens (Recommended):**
- Higher rate limits (10,000-50,000 requests/day)
- Full access to all seller operations
- Requires OAuth user authorization
- Tokens automatically refresh

**Client Credentials (Fallback):**
- Lower rate limits (1,000 requests/day)
- Limited to app-level operations
- No user authorization needed
- Used automatically when user tokens unavailable

### OAuth Scopes & Environment Differences

**Important:** eBay's Production and Sandbox environments support different OAuth scopes. The server automatically validates scopes and warns you when requesting environment-incompatible scopes.

**Key Differences:**
- **Production**: 27 unique scopes (includes `sell.edelivery`, `commerce.shipping`)
- **Sandbox**: 35 unique scopes (includes Buy API scopes, extended Identity scopes, `sell.item.draft`)
- **Common**: 21 scopes available in both environments

**Scope Validation:**
- ✅ Automatic validation when generating OAuth URLs
- ✅ Warnings when loading tokens with environment-incompatible scopes
- ✅ Environment-specific default scopes loaded from JSON files

**Recommendation:** Use default scopes (don't specify `scopes` parameter) to automatically get environment-appropriate scopes.

📚 **For detailed scope information**, see [docs/auth/scope-differences.md](./docs/auth/scope-differences.md)

### API Categories

The server organizes eBay's APIs into logical categories:

- **Account**: Seller policies, payment settings, tax configuration
- **Inventory**: Manage products, offers, and locations
- **Fulfillment**: Process orders, create shipments, issue refunds
- **Marketing**: Campaigns, promotions, and recommendations
- **Analytics**: Sales reports, traffic data, seller metrics
- **Metadata**: Category policies, compatibility rules
- **Taxonomy**: Browse eBay's category tree
- **Communication**: Messages, negotiations, feedback

## Available Tools

This MCP server exposes the following tools:

### General Tools

| Tool | Supported AI |
|---|---|
| `search` | ChatGPT, Claude, Claude Code |
| `fetch` | ChatGPT, Claude, Claude Code |
| `ebay_get_oauth_url` | Claude, Claude Code |
| `ebay_set_user_tokens` | Claude, Claude Code |
| `ebay_get_token_status` | Claude, Claude Code |
| `ebay_clear_tokens` | Claude, Claude Code |
| `create_token_template_file` | Claude, Claude Code |

### Account API
- `ebay_get_custom_policies`
- `ebay_get_fulfillment_policies`
- `ebay_get_payment_policies`
- `ebay_get_return_policies`
- `ebay_create_fulfillment_policy`
- `ebay_get_fulfillment_policy`
- `ebay_get_fulfillment_policy_by_name`
- `ebay_update_fulfillment_policy`
- `ebay_delete_fulfillment_policy`
- `ebay_create_payment_policy`
- `ebay_get_payment_policy`
- `ebay_get_payment_policy_by_name`
- `ebay_update_payment_policy`
- `ebay_delete_payment_policy`
- `ebay_create_return_policy`
- `ebay_get_return_policy`
- `ebay_get_return_policy_by_name`
- `ebay_update_return_policy`
- `ebay_delete_return_policy`
- `ebay_create_custom_policy`
- `ebay_get_custom_policy`
- `ebay_update_custom_policy`
- `ebay_delete_custom_policy`
- `ebay_get_kyc`
- `ebay_opt_in_to_payments_program`
- `ebay_get_payments_program_status`
- `ebay_get_rate_tables`
- `ebay_create_or_replace_sales_tax`
- `ebay_bulk_create_or_replace_sales_tax`
- `ebay_delete_sales_tax`
- `ebay_get_sales_tax`
- `ebay_get_sales_taxes`
- `ebay_get_subscription`
- `ebay_opt_in_to_program`
- `ebay_opt_out_of_program`
- `ebay_get_opted_in_programs`

### Inventory API
- `ebay_get_inventory_items`
- `ebay_get_inventory_item`
- `ebay_create_inventory_item`
- `ebay_get_offers`
- `ebay_create_offer`
- `ebay_publish_offer`
- `ebay_bulk_create_or_replace_inventory_item`
- `ebay_bulk_get_inventory_item`
- `ebay_bulk_update_price_quantity`
- `ebay_get_product_compatibility`
- `ebay_create_or_replace_product_compatibility`
- `ebay_delete_product_compatibility`
- `ebay_get_inventory_item_group`
- `ebay_create_or_replace_inventory_item_group`
- `ebay_delete_inventory_item_group`
- `ebay_get_inventory_locations`
- `ebay_get_inventory_location`
- `ebay_create_or_replace_inventory_location`
- `ebay_delete_inventory_location`
- `ebay_disable_inventory_location`
- `ebay_enable_inventory_location`
- `ebay_update_location_details`
- `ebay_get_offer`
- `ebay_update_offer`
- `ebay_delete_offer`
- `ebay_withdraw_offer`
- `ebay_bulk_create_offer`
- `ebay_bulk_publish_offer`
- `ebay_get_listing_fees`
- `ebay_bulk_migrate_listing`

### Fulfillment API
- `ebay_get_orders`
- `ebay_get_order`
- `ebay_create_shipping_fulfillment`
- `ebay_issue_refund`

### Marketing API
- `ebay_get_campaigns`
- `ebay_get_campaign`
- `ebay_pause_campaign`
- `ebay_resume_campaign`
- `ebay_end_campaign`
- `ebay_update_campaign_identification`
- `ebay_clone_campaign`
- `ebay_get_promotions`
- `ebay_find_listing_recommendations`

### Analytics API
- `ebay_get_traffic_report`
- `ebay_find_seller_standards_profiles`
- `ebay_get_seller_standards_profile`
- `ebay_get_customer_service_metric`

### Metadata API
- `ebay_get_automotive_parts_compatibility_policies`
- `ebay_get_category_policies`
- `ebay_get_extended_producer_responsibility_policies`
- `ebay_get_hazardous_materials_labels`
- `ebay_get_item_condition_policies`
- `ebay_get_listing_structure_policies`
- `ebay_get_negotiated_price_policies`
- `ebay_get_product_safety_labels`
- `ebay_get_regulatory_policies`
- `ebay_get_shipping_cost_type_policies`
- `ebay_get_classified_ad_policies`
- `ebay_get_currencies`
- `ebay_get_listing_type_policies`
- `ebay_get_motors_listing_policies`
- `ebay_get_shipping_policies`
- `ebay_get_site_visibility_policies`
- `ebay_get_compatibilities_by_specification`
- `ebay_get_compatibility_property_names`
- `ebay_get_compatibility_property_values`
- `ebay_get_multi_compatibility_property_values`
- `ebay_get_product_compatibilities`
- `ebay_get_sales_tax_jurisdictions`

### Taxonomy API
- `ebay_get_default_category_tree_id`
- `ebay_get_category_tree`
- `ebay_get_category_suggestions`
- `ebay_get_item_aspects_for_category`

### Communication API
- `ebay_get_offers_to_buyers`
- `ebay_send_offer_to_interested_buyers`
- `ebay_search_messages`

## Endpoint Status

| Endpoint | Last Updated | Production Ready | Tested |
|---|---|---|---|
| Account | 2025-11-10 | Yes | No |
| Inventory | 2025-11-10 | Yes | No |
| Fulfillment | 2025-11-10 | Yes | No |
| Marketing | 2025-11-10 | Yes | No |
| Analytics | 2025-11-10 | Yes | No |
| Metadata | 2025-11-10 | Yes | No |
| Taxonomy | 2025-11-10 | Yes | No |
| Communication | 2025-11-10 | Yes | No |

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
ebay-api-mcp-server/
├── src/
│   ├── api/                          # eBay API client implementations
│   │   ├── account-management/       # Account API
│   │   ├── analytics-and-report/    # Analytics API
│   │   ├── communication/            # Feedback, Message, Negotiation, Notification APIs
│   │   ├── listing-management/       # Inventory API
│   │   ├── listing-metadata/         # Metadata & Taxonomy APIs
│   │   ├── marketing-and-promotions/ # Marketing & Recommendation APIs
│   │   ├── order-management/         # Fulfillment & Dispute APIs
│   │   ├── other/                    # Compliance, Identity, VERO, Translation, eDelivery
│   │   ├── client.ts                 # HTTP client with OAuth integration
│   │   └── index.ts                  # API facade (EbaySellerApi)
│   ├── auth/                         # OAuth 2.0 authentication
│   │   ├── oauth.ts                  # OAuth client with token management
│   │   ├── oauth-metadata.ts         # OAuth discovery metadata
│   │   ├── oauth-middleware.ts       # Express OAuth middleware
│   │   ├── oauth-types.ts            # OAuth type definitions
│   │   ├── token-storage.ts          # File-based token persistence
│   │   └── token-verifier.ts         # JWT token verification
│   ├── config/
│   │   └── environment.ts            # Environment configuration
│   ├── tools/                        # MCP tool definitions
│   │   ├── index.ts                  # Tool dispatcher (executeTool)
│   │   ├── token-template.ts         # Token template generator
│   │   └── tool-definitions.ts       # All 170 tool definitions (Zod schemas)
│   ├── types/                        # TypeScript type definitions
│   │   ├── commerce_*.ts             # Commerce API OpenAPI types
│   │   ├── sell_*.ts                 # Sell API OpenAPI types
│   │   └── ebay.ts                   # Core eBay types
│   ├── utils/                        # Zod validation schemas
│   │   ├── account-management/       # Account API schemas
│   │   ├── analytics-and-report/    # Analytics API schemas
│   │   ├── communication/            # Communication API schemas
│   │   ├── listing-management/       # Inventory API schemas
│   │   ├── listing-metadata/         # Metadata API schemas
│   │   ├── marketing-and-promotions/ # Marketing API schemas
│   │   ├── order-management/         # Order API schemas
│   │   ├── other/                    # Other API schemas
│   │   └── README.md                 # Zod schema documentation
│   ├── index.ts                      # STDIO MCP server entrypoint
│   └── server-http.ts                # HTTP MCP server with OAuth
├── docs/
│   ├── auth/                         # Authentication documentation
│   │   ├── manual-token-config.md   # Manual token setup guide
│   │   └── oauth_custom.json         # Custom OAuth configuration
│   ├── buy-apps/                     # Buy APIs (coming soon)
│   ├── sell-apps/                    # OpenAPI specifications
│   │   ├── account-management/
│   │   ├── analytics-and-report/
│   │   ├── communication/
│   │   ├── listing-management/
│   │   ├── listing-metadata/
│   │   ├── markeitng-and-promotions/
│   │   ├── order-management/
│   │   └── other-apis/
│   └── README.md                     # API documentation index
├── build/                            # Compiled JavaScript output
├── .env                              # Environment configuration
├── CLAUDE.md                         # Claude-specific instructions
├── GEMINI.md                         # Gemini-specific instructions
├── OAUTH-SETUP.md                    # OAuth setup guide
└── README.md                         # This file
```

## Resources

- **eBay Developer Program**: https://developer.ebay.com/
- **eBay API Documentation**: https://developer.ebay.com/docs
- **Model Context Protocol**: https://modelcontextprotocol.io/

## Contributing

Contributions are welcome! Please ensure:
- All API implementations match OpenAPI specifications in `docs/` folder
- TypeScript strict mode compliance
- Proper error handling
- Tool definitions follow MCP specification

## Gemini CLI Setup

To add a custom Model Context Protocol (MCP) server to Gemini CLI, follow these steps:

### 1. Locate or Create the `settings.json` file:

The Gemini CLI uses a `settings.json` file for configuration. This file is typically located in your home directory within a hidden `.gemini` folder: `~/.gemini/settings.json`.
If the `.gemini` directory or `settings.json` file does not exist, create them.

### 2. Edit `settings.json` to configure the MCP server:

Open the `settings.json` file in a text editor.
Add or modify the `mcpServers` object within this JSON file. Each custom MCP server will be an entry within this object.
The configuration for each server will vary depending on the server's requirements, but generally includes details like the server's `command`, `args`, and any necessary authentication tokens or specific parameters.

```json
{
  "mcpServers": {
    "myCustomServerName": {
      "command": "path/to/your/server/executable",
      "args": ["--arg1", "value1", "--arg2", "value2"],
      "env": {
        "API_KEY": "your_api_key"
      }
    },
    "anotherMCPserver": {
      "command": "npx",
      "args": ["-y", "some-mcp-package@latest", "mcp-command"]
    }
  }
}
```

Replace `"myCustomServerName"` with a descriptive name for your server.
Adjust the `command`, `args`, and `env` (for environment variables) according to your specific MCP server's documentation and requirements.

### 3. Install any dependencies:

Ensure that any required dependencies for your custom MCP server are installed on your system.

### 4. Restart Gemini CLI or refresh MCP servers:

After saving the `settings.json` file, restart the Gemini CLI session for the changes to take effect.
Alternatively, if Gemini CLI is already running, you can use the `/mcp refresh` command within the CLI to reload the server configurations.

### 5. Verify the server connection:

Once Gemini CLI has restarted or the MCP servers have been refreshed, use the `/mcp` command within the CLI to list the configured servers and verify that your custom server is recognized and available.
You can also use `/mcp desc <serverName>` to see detailed information about the tools provided by your custom server.

## License

MIT
