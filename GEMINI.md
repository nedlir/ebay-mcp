# Project Overview

This project is an eBay API Model Context Protocol (MCP) server designed to provide AI assistants with access to eBay's seller functionality. It acts as an intermediary, translating AI requests into eBay API calls for tasks such as inventory management, order fulfillment, marketing campaigns, and account configuration.

**Key Technologies:**
*   **Node.js**: Runtime environment for the server.
*   **TypeScript**: Provides type safety and enhances code quality.
*   **eBay Sell APIs**: The core functionality exposed by the server.
*   **Model Context Protocol (MCP)**: Enables seamless integration with AI models like Claude.

The server offers comprehensive access to various eBay Sell APIs, including:
*   Account Management
*   Inventory Management
*   Order Management
*   Marketing & Promotions
*   Analytics
*   Metadata & Taxonomy
*   Communication
*   Compliance
*   Identity
*   Translation
*   VERO
*   eDelivery

# Building and Running

## Prerequisites
*   Node.js 18 or higher
*   eBay Developer account with API credentials

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd ebay-api-mcp-server
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Build the project:**
    ```bash
    npm run build
    ```

## Configuration

1.  **Create a `.env` file:**
    ```bash
    cp .env.example .env
    ```
2.  **Edit `.env`** and add your eBay API credentials (Client ID, Client Secret, and Environment):
    ```env
    EBAY_CLIENT_ID=your_client_id_here
    EBAY_CLIENT_SECRET=your_client_secret_here
    EBAY_ENVIRONMENT=sandbox  # or 'production'
    ```

## Running the Server

*   **Development mode (with hot reload):**
    ```bash
    npm run dev
    ```
*   **Production mode:**
    ```bash
    npm start
    ```

# Development Conventions

*   **TypeScript:** The project is written in TypeScript, emphasizing type safety.
*   **API Implementations:** All API implementations are expected to match OpenAPI specifications found in the `docs/` folder.
*   **Error Handling:** Proper error handling is a key consideration.
*   **Tool Definitions:** MCP tool definitions follow the MCP specification.

## Useful Development Commands

*   **Type check:**
    ```bash
    npm run typecheck
    ```
*   **Watch mode for development:**
    ```bash
    npm run watch
    ```
*   **Clean build artifacts:**
    ```bash
    npm run clean
    ```
*   **Rebuild:**
    ```bash
    npm run build
    ```

# Project Structure

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

# Authentication

The server utilizes **eBay's OAuth 2.0 Client Credentials flow**. Key aspects include:
*   Automatic management and refreshing of access tokens.
*   Tokens are cached with a 60-second safety buffer before expiry.
*   All API requests automatically include valid authentication.

# Error Handling

The server provides detailed error messages for various scenarios, including:
*   Authentication failures (invalid credentials, expired tokens).
*   eBay API validation errors.
*   Invalid parameters for tool arguments.
*   Network issues (connection timeouts, network errors).
Errors are returned in an MCP-compatible format for proper handling by AI clients.

# Best Practices

1.  **Start with Sandbox Environment:** Always test with `EBAY_ENVIRONMENT=sandbox` before using production.
2.  **Use Appropriate OAuth Scopes:** Ensure your eBay application has the necessary OAuth scopes (e.g., `https://api.ebay.com/oauth/api_scope`, `https://api.ebay.com/oauth/api_scope/sell.account`).
3.  **Handle Rate Limits:** Be aware that eBay enforces rate limits (default: 5,000 calls/day; burst: up to 10 calls/second).
4.  **Secure Credential Storage:** Never commit `.env` files to version control. Use environment variables in production and rotate credentials regularly.
5.  **Monitor API Usage:** Regularly check the [eBay Developer Portal](https://developer.ebay.com/my/api_dashboard) for usage, deprecation notices, and API call logs.

# Troubleshooting

## Server won't start
*   **Check Node version:** Must be 18+ (`node --version`).
*   **Rebuild the project:** `npm run clean && npm run build`.
*   **Check for TypeScript errors:** `npm run typecheck`.

## Authentication errors
*   **Verify credentials:** Ensure `EBAY_CLIENT_ID` and `EBAY_CLIENT_SECRET` are set.
*   **Check environment setting:** Confirm `EBAY_ENVIRONMENT` is set correctly (`sandbox` or `production`).
*   **Test credentials:** Validate your credentials on the [eBay Developer Portal](https://developer.ebay.com/my/keys).

## MCP connection issues
*   Ensure absolute paths are used in your MCP configuration.
*   Restart the AI client after making configuration changes.
*   Check server logs for error messages.
*   Verify that the `build` directory exists and contains compiled JavaScript files.

# Resources

*   **eBay Developer Program**: https://developer.ebay.com/
*   **eBay API Documentation**: https://developer.ebay.com/docs
*   **Model Context Protocol**: https://modelcontextprotocol.io/
*   **MCP Specification**: https://spec.modelcontextprotocol.io/
*   **eBay Sandbox**: https://developer.ebay.com/sandbox

# Contributing

Contributions are welcome! Please ensure:
*   All API implementations match OpenAPI specifications in the `docs/` folder.
*   TypeScript strict mode compliance.
*   Proper error handling.
*   Tool definitions follow the MCP specification.

# License

MIT

# Support
*   **This MCP server**: Open an issue in this repository.
*   **eBay APIs**: Visit [eBay Developer Forums](https://community.ebay.com/t5/Developer-Forums/ct-p/devforums).
*   **MCP Protocol**: Visit [MCP Documentation](https://modelcontextprotocol.io/docs).
