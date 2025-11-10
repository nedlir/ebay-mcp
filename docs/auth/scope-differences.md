# OAuth Scope Differences: Production vs Sandbox

## Overview

eBay's Production and Sandbox environments support different OAuth scopes. Understanding these differences is critical for proper authentication and avoiding authorization errors.

**Key Statistics:**
- **Production**: 27 unique scopes
- **Sandbox**: 35 unique scopes
- **Common**: 21 scopes available in both environments

## Environment-Specific Scopes

### Production-Only Scopes

These scopes are **only** available in the Production environment:

| Scope | Description | Use Case |
|-------|-------------|----------|
| `https://api.ebay.com/oauth/api_scope/sell.edelivery` | Digital delivery API access | International shipping, eDelivery services |
| `https://api.ebay.com/oauth/api_scope/commerce.shipping` | Shipping services | Advanced shipping operations |

### Sandbox-Only Scopes

These scopes are **only** available in the Sandbox environment:

| Scope | Description | Use Case |
|-------|-------------|----------|
| `https://api.ebay.com/oauth/api_scope/buy.browse` | Browse Buy API | Testing buyer-facing features |
| `https://api.ebay.com/oauth/api_scope/buy.feed` | Buy feed API | Testing feed downloads |
| `https://api.ebay.com/oauth/api_scope/buy.item.feed` | Item feed access | Testing item feed functionality |
| `https://api.ebay.com/oauth/api_scope/buy.marketing` | Buy marketing API | Testing buyer marketing features |
| `https://api.ebay.com/oauth/api_scope/buy.offer.auction` | Auction offers | Testing auction bidding |
| `https://api.ebay.com/oauth/api_scope/buy.order` | Buy order API | Testing order placement |
| `https://api.ebay.com/oauth/api_scope/buy.product.match` | Product matching | Testing product search/matching |
| `https://api.ebay.com/oauth/api_scope/commerce.identity.address.readonly` | Read address identity | Testing address verification |
| `https://api.ebay.com/oauth/api_scope/commerce.identity.email.readonly` | Read email identity | Testing email verification |
| `https://api.ebay.com/oauth/api_scope/commerce.identity.name.readonly` | Read name identity | Testing name verification |
| `https://api.ebay.com/oauth/api_scope/commerce.identity.phone.readonly` | Read phone identity | Testing phone verification |
| `https://api.ebay.com/oauth/api_scope/commerce.identity.status.readonly` | Read identity status | Testing account status |
| `https://api.ebay.com/oauth/api_scope/sell.item.draft` | Draft item management | Testing draft listings |

## Common Scopes (Available in Both Environments)

These scopes work in **both** Production and Sandbox:

### Core Sell API Scopes
- `https://api.ebay.com/oauth/api_scope`
- `https://api.ebay.com/oauth/api_scope/sell.account`
- `https://api.ebay.com/oauth/api_scope/sell.account.readonly`
- `https://api.ebay.com/oauth/api_scope/sell.analytics.readonly`
- `https://api.ebay.com/oauth/api_scope/sell.fulfillment`
- `https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly`
- `https://api.ebay.com/oauth/api_scope/sell.inventory`
- `https://api.ebay.com/oauth/api_scope/sell.inventory.readonly`
- `https://api.ebay.com/oauth/api_scope/sell.item`
- `https://api.ebay.com/oauth/api_scope/sell.marketing`
- `https://api.ebay.com/oauth/api_scope/sell.marketing.readonly`

### Commerce API Scopes
- `https://api.ebay.com/oauth/api_scope/commerce.catalog.readonly`
- `https://api.ebay.com/oauth/api_scope/commerce.identity.readonly`
- `https://api.ebay.com/oauth/api_scope/commerce.notification.subscription`
- `https://api.ebay.com/oauth/api_scope/commerce.notification.subscription.readonly`

### Other Scopes
- `https://api.ebay.com/oauth/api_scope/sell.finances`
- `https://api.ebay.com/oauth/api_scope/sell.payment.dispute`
- `https://api.ebay.com/oauth/api_scope/sell.reputation`
- `https://api.ebay.com/oauth/api_scope/sell.reputation.readonly`

## Scope Validation in This MCP Server

### Automatic Validation

This MCP server automatically validates scopes against the environment:

1. **On OAuth URL Generation** (`ebay_get_oauth_url` tool):
   - Validates requested scopes against environment
   - Returns warnings for environment-incompatible scopes
   - Still includes incompatible scopes in URL (eBay will reject them)

2. **On Token Loading** (server startup):
   - Validates stored token scopes against current environment
   - Logs warnings to console if scopes mismatch
   - Allows tokens to be used (some operations may fail)

### Warning Examples

```json
{
  "authorizationUrl": "https://signin.sandbox.ebay.com/...",
  "warnings": [
    "Scope \"https://api.ebay.com/oauth/api_scope/sell.edelivery\" is only available in production environment, not in sandbox. This scope will be requested but may be rejected by eBay."
  ]
}
```

Console output:
```
⚠️  Token scope validation warnings:
  - Scope "https://api.ebay.com/oauth/api_scope/buy.browse" is only available in sandbox environment, not in production. This scope will be requested but may be rejected by eBay.
  Token will still be used, but some scopes may not work in this environment.
```

## Best Practices

### 1. Match Scopes to Environment

**❌ DON'T:**
```javascript
// Using production-specific scope in sandbox
const scopes = [
  "https://api.ebay.com/oauth/api_scope/sell.inventory",
  "https://api.ebay.com/oauth/api_scope/sell.edelivery"  // Production-only!
];
// In sandbox environment - will fail
```

**✅ DO:**
```javascript
// Use environment-appropriate scopes
const environment = process.env.EBAY_ENVIRONMENT || "sandbox";

// Let the server use default scopes for the environment
// Or explicitly check environment before adding scopes
const scopes = ["https://api.ebay.com/oauth/api_scope/sell.inventory"];
if (environment === "production") {
  scopes.push("https://api.ebay.com/oauth/api_scope/sell.edelivery");
}
```

### 2. Use Default Scopes

The MCP server provides default scopes for each environment:

```typescript
// src/config/environment.ts
export function getDefaultScopes(environment: "production" | "sandbox"): string[]
```

**Recommended approach:**
```javascript
// Don't specify scopes - let the server use defaults
const result = await use_mcp_tool("ebay_get_oauth_url", {
  redirectUri: "https://your-app.com/callback"
  // No scopes parameter - uses defaults for current environment
});
```

### 3. Testing Workflow

1. **Develop in Sandbox:**
   ```bash
   EBAY_ENVIRONMENT=sandbox
   ```
   - Test with sandbox-specific scopes (Buy API, draft items, etc.)
   - Validate core functionality

2. **Deploy to Production:**
   ```bash
   EBAY_ENVIRONMENT=production
   ```
   - Re-authenticate with production scopes
   - Remove sandbox-only scopes from your authorization flow
   - Test production-specific features (eDelivery, etc.)

### 4. Handling Scope Errors

If you encounter scope-related errors:

```
Error: Access denied. The user does not have permission to access the resource.
```

**Diagnosis Steps:**

1. **Check environment configuration:**
   ```bash
   echo $EBAY_ENVIRONMENT
   ```

2. **Use `ebay_get_token_status` tool:**
   ```javascript
   const status = await use_mcp_tool("ebay_get_token_status", {});
   console.log("Environment:", status.environment);
   console.log("Scopes:", status.scopes);
   ```

3. **Verify scope compatibility:**
   - Cross-reference your token scopes with the environment
   - Check if you're using environment-specific scopes
   - Review the [scope reference files](../auth/):
     - `production_scopes.json`
     - `sandbox_scopes.json`

4. **Re-authenticate if needed:**
   ```javascript
   // 1. Clear old tokens
   await use_mcp_tool("ebay_clear_tokens", {});

   // 2. Get new OAuth URL with correct scopes
   const result = await use_mcp_tool("ebay_get_oauth_url", {
     redirectUri: "https://your-app.com/callback"
     // Uses environment-appropriate default scopes
   });

   // 3. Complete OAuth flow and set new tokens
   await use_mcp_tool("ebay_set_user_tokens", {
     accessToken: "...",
     refreshToken: "..."
   });
   ```

## Implementation Details

### Scope Validation Function

Location: `src/config/environment.ts:79-112`

```typescript
export function validateScopes(
  scopes: string[],
  environment: "production" | "sandbox"
): { warnings: string[]; validScopes: string[] }
```

**Behavior:**
- Loads environment-specific scopes from JSON files
- Checks each requested scope against valid scopes
- Identifies cross-environment scope requests
- Returns warnings array + validated scopes
- **Still includes invalid scopes** (eBay authorization server will reject them)

### Scope Data Files

**Production Scopes:** `docs/auth/production_scopes.json`
- 27 unique production scopes
- Includes eDelivery and commerce.shipping

**Sandbox Scopes:** `docs/auth/sandbox_scopes.json`
- 35 unique sandbox scopes
- Includes Buy API scopes and extended Identity scopes
- Includes draft item management

### Dynamic Scope Loading

The scope validation system loads scopes dynamically from JSON files:

```typescript
// src/config/environment.ts:21-75
function getProductionScopes(): string[]
function getSandboxScopes(): string[]
```

This allows for:
- Easy updates when eBay adds new scopes
- No code changes required for scope updates
- Centralized scope management

## Troubleshooting

### Problem: "Scope not available in this environment" warning

**Cause:** Requesting a scope that doesn't exist in the current environment

**Solution:**
1. Check the environment: `echo $EBAY_ENVIRONMENT`
2. Review scope lists above
3. Either:
   - Remove environment-specific scope from your request
   - Switch to the correct environment
   - Use default scopes instead of custom scopes

### Problem: Authorization fails silently

**Cause:** eBay authorization server rejected invalid scopes

**Solution:**
1. Check browser URL after authorization redirect
2. Look for error parameters: `?error=invalid_scope`
3. Review scope warnings from `ebay_get_oauth_url`
4. Re-authenticate with environment-appropriate scopes

### Problem: Some API calls fail with 403 Forbidden

**Cause:** Token doesn't have required scopes for the operation

**Solution:**
1. Check current token scopes: `ebay_get_token_status`
2. Identify missing scopes for the operation (see [scope-requirements.md](./scope-requirements.md))
3. Re-authenticate with additional scopes
4. Ensure scopes are valid for current environment

## Migration Between Environments

### Sandbox → Production

When moving from sandbox to production:

1. **Update environment variable:**
   ```bash
   EBAY_ENVIRONMENT=production
   ```

2. **Remove sandbox-only scopes:**
   - Buy API scopes (`buy.*`)
   - Extended Identity scopes (`commerce.identity.*.readonly`)
   - Draft item management (`sell.item.draft`)

3. **Add production-only scopes (if needed):**
   - eDelivery: `sell.edelivery`
   - Shipping: `commerce.shipping`

4. **Re-authenticate:**
   - Clear old tokens
   - Generate new OAuth URL
   - Complete user authorization
   - Set new tokens

### Production → Sandbox

When testing production features in sandbox:

1. **Update environment variable:**
   ```bash
   EBAY_ENVIRONMENT=sandbox
   ```

2. **Note limitations:**
   - eDelivery features not available
   - Some shipping features not available

3. **Add testing-specific scopes (if needed):**
   - Buy API scopes for buyer testing
   - Draft items for listing testing

4. **Re-authenticate** with sandbox scopes

## Reference

### Complete Scope Lists

For complete, up-to-date scope lists with descriptions:

- **Production:** [production_scopes.json](./production_scopes.json)
- **Sandbox:** [sandbox_scopes.json](./sandbox_scopes.json)

### Related Documentation

- [OAuth Setup Guide](./README.md)
- [Scope Requirements by Tool](./scope-requirements.md)
- [Troubleshooting Guide](./troubleshooting.md)
- [Manual Token Configuration](./manual-token-config.md)

### eBay Official Documentation

- [OAuth Scopes Reference](https://developer.ebay.com/api-docs/static/oauth-scopes.html)
- [Authorization Code Grant](https://developer.ebay.com/api-docs/static/oauth-authorization-code-grant.html)
- [Sandbox vs Production](https://developer.ebay.com/api-docs/static/ebay-rest/sandbox.html)

---

**Last Updated:** 2025-11-11
**Server Version:** 1.0.0
**Status:** Environment-specific scope validation active
