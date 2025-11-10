
# Manual Token Configuration

This document explains how to manually configure the eBay MCP server with your OAuth 2.0 tokens. This is an alternative to using the `ebay_set_user_tokens` tool and is useful for local development and testing.

## Steps

1.  **Create the Token File:**
    Create a file named `.ebay-mcp-tokens.json` in your home directory.
    *   **macOS/Linux:** `~/.ebay-mcp-tokens.json`
    *   **Windows:** `C:\Users\your-username\.ebay-mcp-tokens.json`

2.  **Add Token Information:**
    Open the file and add a JSON object with the following structure:

    ```json
    {
      "accessToken": "your-v-^1-...",
      "refreshToken": "your-v-^1-...",
      "tokenType": "Bearer",
      "accessTokenExpiry": 1767225600000,
      "refreshTokenExpiry": 1825363200000,
      "scope": "https://api.ebay.com/oauth/api_scope ..."
    }
    ```

    **Replace the placeholder values:**
    *   `accessToken`: Your eBay access token.
    *   `refreshToken`: Your eBay refresh token.
    *   `accessTokenExpiry`: The expiration timestamp of the access token in **milliseconds**.
    *   `refreshTokenExpiry`: The expiration timestamp of the refresh token in **milliseconds**.
    *   `scope`: The OAuth scopes your tokens are authorized for.

3.  **Start the Server:**
    Start the MCP server. It will automatically detect and use the tokens from the `.ebay-mcp-tokens.json` file.

## Authentication Flow

The server uses the following priority for authentication:

1.  **Manual Token File:** If `.ebay-mcp-tokens.json` exists, the server will use these tokens.
2.  **`ebay_set_user_tokens` Tool:** If the file doesn't exist, a user or LLM can provide tokens using the `ebay_set_user_tokens` tool, which will create the file.
3.  **Client Credentials:** If no user tokens are provided, the server falls back to the client credentials flow, which has a lower API rate limit.
