import { EbaySellerApi } from './src/api/index.js';
import { getEbayConfig } from './src/config/environment.js';

async function quickTest() {
  console.log('🔍 Testing eBay MCP Token Refresh...\n');

  const api = new EbaySellerApi(getEbayConfig());
  await api.initialize();

  console.log('📊 Initial token status:');
  console.log(api.getTokenInfo());
  console.log();

  const authClient = api.getAuthClient().getOAuthClient();

  try {
    console.log('🔄 Attempting token refresh...');
    await authClient.refreshUserToken();
    console.log('✅ SUCCESS! Token refreshed');
    console.log();
    console.log('📊 Updated token info:');
    console.log(api.getTokenInfo());
  } catch (error) {
    console.log('❌ FAILED:', error instanceof Error ? error.message : String(error));
  }
}

quickTest().catch(console.error);
