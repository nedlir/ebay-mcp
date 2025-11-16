import axios from 'axios';
import { config } from 'dotenv';

config();

async function diagnoseToken() {
  console.log('🔍 eBay Token Refresh Diagnostic\n');

  const clientId = process.env.EBAY_CLIENT_ID;
  const clientSecret = process.env.EBAY_CLIENT_SECRET;
  const refreshToken = process.env.EBAY_USER_REFRESH_TOKEN;
  const environment = process.env.EBAY_ENVIRONMENT || 'sandbox';

  console.log('📋 Configuration:');
  console.log(`   Environment: ${environment}`);
  console.log(`   Client ID: ${clientId?.substring(0, 20)}...`);
  console.log(`   Client Secret: ${clientSecret?.substring(0, 10)}...`);
  console.log(`   Refresh Token: ${refreshToken?.substring(0, 30)}...`);
  console.log();

  if (!clientId || !clientSecret || !refreshToken) {
    console.log('❌ Missing credentials in .env file');
    return;
  }

  const baseUrl = environment === 'production'
    ? 'https://api.ebay.com'
    : 'https://api.sandbox.ebay.com';
  const tokenUrl = `${baseUrl}/identity/v1/oauth2/token`;

  console.log('🎯 Token Endpoint:', tokenUrl);
  console.log();

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  console.log('📤 Request Details:');
  console.log('   Method: POST');
  console.log('   Content-Type: application/x-www-form-urlencoded');
  console.log('   Authorization: Basic [REDACTED]');
  console.log('   Body:', params.toString());
  console.log();

  try {
    console.log('🔄 Sending request to eBay...');
    const response = await axios.post(tokenUrl, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${credentials}`,
      },
    });

    console.log('✅ SUCCESS! Token refreshed');
    console.log();
    console.log('📊 Response:');
    console.log('   Status:', response.status);
    console.log('   Access Token:', response.data.access_token?.substring(0, 40) + '...');
    console.log('   Token Type:', response.data.token_type);
    console.log('   Expires In:', response.data.expires_in, 'seconds');
    if (response.data.refresh_token) {
      console.log('   New Refresh Token:', response.data.refresh_token?.substring(0, 40) + '...');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('❌ FAILED');
      console.log();
      console.log('📊 Error Response:');
      console.log('   Status:', error.response?.status);
      console.log('   Status Text:', error.response?.statusText);
      console.log('   Headers:', JSON.stringify(error.response?.headers, null, 2));
      console.log('   Data:', JSON.stringify(error.response?.data, null, 2));
      console.log();

      if (error.response?.status === 503) {
        console.log('🔍 Diagnosis for 503 Error:');
        console.log('   - eBay servers are unavailable or experiencing issues');
        console.log('   - Your refresh token may be expired/revoked');
        console.log('   - Your sandbox environment may not be properly set up');
        console.log();
        console.log('💡 Next Steps:');
        console.log('   1. Verify your eBay Developer account is active');
        console.log('   2. Check if your sandbox app is set up correctly');
        console.log('   3. Generate a fresh refresh token through OAuth flow');
        console.log('   4. Visit: https://developer.ebay.com/my/keys');
      } else if (error.response?.status === 400) {
        console.log('🔍 Diagnosis for 400 Error:');
        console.log('   - Refresh token is likely invalid or expired');
        console.log('   - You need to regenerate tokens through OAuth flow');
      } else if (error.response?.status === 401) {
        console.log('🔍 Diagnosis for 401 Error:');
        console.log('   - Client credentials (ID/Secret) are incorrect');
        console.log('   - Check EBAY_CLIENT_ID and EBAY_CLIENT_SECRET in .env');
      }
    } else {
      console.log('❌ Unexpected error:', error);
    }
  }
}

diagnoseToken().catch(console.error);
