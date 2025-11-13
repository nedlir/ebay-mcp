#!/usr/bin/env tsx
// @ts-nocheck - Test script with dynamic API calls

/**
 * Endpoint Testing Script - Failure-Focused Logging
 *
 * This script tests all eBay API endpoints and ONLY logs failures and errors.
 * Success cases are counted but not logged to keep the output clean and focused
 * on what needs to be fixed.
 *
 * Usage: npm run test:endpoints
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { EbaySellerApi } from '@/api/index.js';
import { getEbayConfig } from '@/config/environment.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Types for test results
interface EndpointFailure {
  endpoint: string;
  category: string;
  method: string;
  status: 'error' | 'skipped';
  timestamp: string;
  duration: number;
  error: string;
  params?: any;
  statusCode?: number;
  errorDetails?: any;
}

interface TestSummary {
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  timestamp: string;
  failures: EndpointFailure[];
}

class EndpointTester {
  private api!: EbaySellerApi;
  private failures: EndpointFailure[] = [];
  private passCount = 0;
  private logsDir: string;
  private runId: string;

  constructor() {
    this.runId = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    this.logsDir = path.join(__dirname, '..', 'logs', 'endpoint-tests', this.runId);
  }

  async initialize(): Promise<void> {
    console.log('🔧 Initializing endpoint tester...\n');

    // Create logs directory
    fs.mkdirSync(this.logsDir, { recursive: true });
    console.log(`📁 Logs directory: ${this.logsDir}\n`);

    // Load config and initialize API
    const config = getEbayConfig();
    this.api = new EbaySellerApi(config);
    await this.api.initialize();

    // Check authentication
    const hasUserTokens = this.api.hasUserTokens();
    console.log(`🔐 Authentication: ${hasUserTokens ? '✅ User tokens' : '⚠️  Client credentials only'}\n`);

    if (!hasUserTokens) {
      console.log('⚠️  WARNING: Many endpoints require user authorization.\n');
      console.log('Set EBAY_USER_REFRESH_TOKEN in .env for full coverage.\n');
    }
  }

  private async testEndpoint(
    category: string,
    endpoint: string,
    method: string,
    testFn: () => Promise<any>,
    params?: any
  ): Promise<void> {
    const startTime = Date.now();

    try {
      await testFn();
      const duration = Date.now() - startTime;
      this.passCount++;
      // Silent success - only log dot for progress
      process.stdout.write('.');
    } catch (error: any) {
      const duration = Date.now() - startTime;

      // Check if it's an expected error (like 404 for non-existent resource)
      const isSkipped = error.statusCode === 404 || error.statusCode === 204;

      const failure: EndpointFailure = {
        endpoint,
        category,
        method,
        status: isSkipped ? 'skipped' : 'error',
        timestamp: new Date().toISOString(),
        duration,
        error: error.message || String(error),
        params,
        statusCode: error.statusCode,
        errorDetails: error.response?.data || error.errors,
      };

      this.failures.push(failure);

      // Log failures immediately
      if (isSkipped) {
        console.log(`\n  ⏭️  ${endpoint}: No data (${duration}ms)`);
      } else {
        console.log(`\n  ❌ ${endpoint}: ${failure.error} (${duration}ms)`);
      }
    }
  }

  async testAccountManagementApis(): Promise<void> {
    console.log('\n📋 Account Management APIs');
    await this.testEndpoint(
      'Account Management',
      'getFulfillmentPolicies',
      'GET /sell/account/v1/fulfillment_policy',
      () => this.api.account.getFulfillmentPolicies('EBAY_US'),
      { marketplace_id: 'EBAY_US' }
    );
    await this.testEndpoint(
      'Account Management',
      'getPaymentPolicies',
      'GET /sell/account/v1/payment_policy',
      () => this.api.account.getPaymentPolicies('EBAY_US'),
      { marketplace_id: 'EBAY_US' }
    );
    await this.testEndpoint(
      'Account Management',
      'getReturnPolicies',
      'GET /sell/account/v1/return_policy',
      () => this.api.account.getReturnPolicies('EBAY_US'),
      { marketplace_id: 'EBAY_US' }
    );
    await this.testEndpoint(
      'Account Management',
      'getPrivileges',
      'GET /sell/account/v1/privilege',
      () => this.api.account.getPrivileges()
    );
    await this.testEndpoint(
      'Account Management',
      'getRateTables',
      'GET /sell/account/v1/rate_table',
      () => this.api.account.getRateTables()
    );
    await this.testEndpoint(
      'Account Management',
      'getSubscription',
      'GET /sell/account/v1/subscription',
      () => this.api.account.getSubscription()
    );
    await this.testEndpoint(
      'Account Management',
      'getSalesTaxes',
      'GET /sell/account/v1/sales_tax',
      () => this.api.account.getSalesTaxes('US'),
      { country_code: 'US' }
    );
    console.log(''); // Newline after dots
  }

  async testInventoryApis(): Promise<void> {
    console.log('\n📦 Inventory APIs');
    await this.testEndpoint(
      'Inventory',
      'getInventoryItems',
      'GET /sell/inventory/v1/inventory_item',
      () => this.api.inventory.getInventoryItems(5, 0),
      { limit: 5, offset: 0 }
    );
    await this.testEndpoint(
      'Inventory',
      'getOffers',
      'GET /sell/inventory/v1/offer',
      () => this.api.inventory.getOffers(undefined, 'EBAY_US', 5),
      { marketplaceId: 'EBAY_US', limit: 5 }
    );
    await this.testEndpoint(
      'Inventory',
      'getInventoryLocations',
      'GET /sell/inventory/v1/location',
      () => this.api.inventory.getInventoryLocations(5, 0),
      { limit: 5, offset: 0 }
    );
    await this.testEndpoint(
      'Inventory',
      'getListingFees',
      'POST /sell/inventory/v1/offer/get_listing_fees',
      () => this.api.inventory.getListingFees([]),
      { offerIds: [] }
    );
    console.log('');
  }

  async testFulfillmentApis(): Promise<void> {
    console.log('\n📮 Fulfillment APIs');
    await this.testEndpoint(
      'Fulfillment',
      'getOrders',
      'GET /sell/fulfillment/v1/order',
      () => this.api.fulfillment.getOrders({ limit: 5 }),
      { limit: 5 }
    );
    console.log('');
  }

  async testMarketingApis(): Promise<void> {
    console.log('\n📢 Marketing APIs');
    await this.testEndpoint(
      'Marketing',
      'getCampaigns',
      'GET /sell/marketing/v1/ad_campaign',
      () => this.api.marketing.getCampaigns({ limit: 5 }),
      { limit: 5 }
    );
    await this.testEndpoint(
      'Marketing',
      'getAdGroups',
      'GET /sell/marketing/v1/ad_campaign/{campaign_id}/ad_group',
      async () => {
        try {
          const campaigns = await this.api.marketing.getCampaigns({ limit: 1 });
          if (campaigns.campaigns && campaigns.campaigns.length > 0) {
            const campaignId = campaigns.campaigns[0].campaignId;
            return await this.api.marketing.getAdGroups(campaignId!, { limit: 5 });
          }
        } catch (error) {
          // Fall through to test with dummy ID
        }
        return await this.api.marketing.getAdGroups('test-campaign-id', { limit: 5 });
      },
      { campaign_id: 'test-campaign-id', limit: 5 }
    );
    await this.testEndpoint(
      'Marketing',
      'getPromotions',
      'GET /sell/marketing/v1/promotion',
      () => this.api.marketing.getPromotions('EBAY_US', 5),
      { marketplace_id: 'EBAY_US', limit: 5 }
    );
    console.log('');
  }

  async testAnalyticsApis(): Promise<void> {
    console.log('\n📊 Analytics APIs');
    await this.testEndpoint(
      'Analytics',
      'getTrafficReport',
      'GET /sell/analytics/v1/traffic_report',
      () => this.api.analytics.getTrafficReport('LISTING_ID', 'filter', 'CLICK_THROUGH_RATE'),
      { dimension: 'LISTING_ID', filter: 'filter', metric: 'CLICK_THROUGH_RATE' }
    );
    await this.testEndpoint(
      'Analytics',
      'getSellerStandardsProfile',
      'GET /sell/analytics/v1/seller_standards_profile',
      () => this.api.analytics.getSellerStandardsProfile('LATE_SHIPMENT_RATE', 'CURRENT')
    );
    console.log('');
  }

  async testCommunicationApis(): Promise<void> {
    console.log('\n💬 Communication APIs');
    await this.testEndpoint(
      'Communication',
      'getCustomerServiceMetric',
      'GET /sell/analytics/v1/customer_service_metric',
      () => this.api.analytics.getCustomerServiceMetric('ITEM_NOT_AS_DESCRIBED', 'CURRENT', 'EBAY_US'),
      { customerServiceMetricType: 'ITEM_NOT_AS_DESCRIBED', evaluationType: 'CURRENT', evaluationMarketplaceId: 'EBAY_US' }
    );
    console.log('');
  }

  async testMetadataApis(): Promise<void> {
    console.log('\n🔍 Metadata APIs');
    await this.testEndpoint(
      'Metadata',
      'getAutomotivePartsCompatibilityPolicies',
      'GET /sell/metadata/v1/automotive_parts_compatibility_policy',
      () => this.api.metadata.getAutomotivePartsCompatibilityPolicies('EBAY_US'),
      { marketplace_id: 'EBAY_US' }
    );
    await this.testEndpoint(
      'Metadata',
      'getListingStructurePolicies',
      'GET /sell/metadata/v1/listing_structure',
      () => this.api.metadata.getListingStructurePolicies('EBAY_US'),
      { marketplace_id: 'EBAY_US' }
    );
    await this.testEndpoint(
      'Metadata',
      'getRegulatoryPolicies',
      'GET /sell/metadata/v1/regulatory_policy',
      () => this.api.metadata.getRegulatoryPolicies('EBAY_US'),
      { marketplace_id: 'EBAY_US' }
    );
    console.log('');
  }

  async testTaxonomyApis(): Promise<void> {
    console.log('\n🌳 Taxonomy APIs');
    await this.testEndpoint(
      'Taxonomy',
      'getCategoryTree',
      'GET /commerce/taxonomy/v1/category_tree/{category_tree_id}',
      () => this.api.taxonomy.getCategoryTree('0'),
      { category_tree_id: '0' }
    );
    await this.testEndpoint(
      'Taxonomy',
      'getCategorySuggestions',
      'GET /commerce/taxonomy/v1/category_tree/{category_tree_id}/get_category_suggestions',
      () => this.api.taxonomy.getCategorySuggestions('0', 'iPhone'),
      { category_tree_id: '0', q: 'iPhone' }
    );
    await this.testEndpoint(
      'Taxonomy',
      'getCategorySubtree',
      'GET /commerce/taxonomy/v1/category_tree/{category_tree_id}/get_category_subtree',
      () => this.api.taxonomy.getCategorySubtree('0', '9355'),
      { category_tree_id: '0', category_id: '9355' }
    );
    console.log('');
  }

  async testOtherApis(): Promise<void> {
    console.log('\n🔧 Other APIs');
    await this.testEndpoint(
      'Other',
      'getUser',
      'GET /commerce/identity/v1/user',
      () => this.api.identity.getUser()
    );
    await this.testEndpoint(
      'Other',
      'getListingViolations',
      'GET /sell/compliance/v1/listing_violation',
      () => this.api.compliance.getListingViolations({ limit: 5 }),
      { limit: 5 }
    );
    await this.testEndpoint(
      'Other',
      'getVeroReasonCodes',
      'GET /sell/compliance/v1/vero_reason_code',
      () => this.api.vero.getVeroReasonCodes()
    );
    await this.testEndpoint(
      'Other',
      'getShippingServices',
      'GET /sell/logistics/v1_beta/services',
      () => this.api.edelivery.getShippingServices()
    );
    await this.testEndpoint(
      'Other',
      'getAgents',
      'GET /sell/logistics/v1_beta/agents',
      () => this.api.edelivery.getAgents()
    );
    console.log('');
  }

  private writeFailuresLog(): void {
    if (this.failures.length === 0) {
      console.log('\n✅ No failures to log - all tests passed!\n');
      return;
    }

    const failuresFile = path.join(this.logsDir, 'FAILURES.log');
    const lines: string[] = [
      `╔${'═'.repeat(78)}╗`,
      `║ ENDPOINT FAILURES - REQUIRES DEBUGGING${' '.repeat(38)}║`,
      `║ Run ID: ${this.runId}${' '.repeat(78 - this.runId.length - 10)}║`,
      `║ Timestamp: ${new Date().toISOString()}${' '.repeat(78 - new Date().toISOString().length - 13)}║`,
      `╚${'═'.repeat(78)}╝`,
      '',
      `Total Failures: ${this.failures.length}`,
      `Errors: ${this.failures.filter(f => f.status === 'error').length}`,
      `Skipped: ${this.failures.filter(f => f.status === 'skipped').length}`,
      '',
      '═'.repeat(80),
      '',
    ];

    // Group by category
    const byCategory = new Map<string, EndpointFailure[]>();
    for (const failure of this.failures) {
      if (!byCategory.has(failure.category)) {
        byCategory.set(failure.category, []);
      }
      byCategory.get(failure.category)!.push(failure);
    }

    for (const [category, failures] of byCategory) {
      lines.push(`▶ ${category.toUpperCase()}`);
      lines.push('─'.repeat(80));
      lines.push('');

      for (const failure of failures) {
        const icon = failure.status === 'error' ? '❌' : '⏭️';
        lines.push(`${icon} ${failure.endpoint}`);
        lines.push(`   HTTP Method: ${failure.method}`);
        lines.push(`   Status: ${failure.status.toUpperCase()}`);
        lines.push(`   Duration: ${failure.duration}ms`);

        if (failure.statusCode) {
          lines.push(`   HTTP Code: ${failure.statusCode}`);
        }

        if (failure.params) {
          lines.push(`   Parameters:`);
          lines.push(`   ${JSON.stringify(failure.params, null, 2).split('\n').join('\n   ')}`);
        }

        lines.push(`   Error: ${failure.error}`);

        if (failure.errorDetails) {
          lines.push(`   Details:`);
          const detailsStr = JSON.stringify(failure.errorDetails, null, 2);
          lines.push(`   ${detailsStr.split('\n').join('\n   ')}`);
        }

        lines.push('');
        lines.push('─'.repeat(80));
        lines.push('');
      }
    }

    fs.writeFileSync(failuresFile, lines.join('\n'));
    console.log(`\n📝 Failures logged to: ${failuresFile}\n`);
  }

  private writeSummaryLog(summary: TestSummary): void {
    const summaryFile = path.join(this.logsDir, 'SUMMARY.log');
    const jsonFile = path.join(this.logsDir, 'summary.json');

    const lines: string[] = [
      `╔${'═'.repeat(78)}╗`,
      `║ ENDPOINT TEST SUMMARY${' '.repeat(56)}║`,
      `║ Run ID: ${this.runId}${' '.repeat(78 - this.runId.length - 10)}║`,
      `╚${'═'.repeat(78)}╝`,
      '',
      `Total Tests:     ${summary.totalTests}`,
      `✅ Passed:       ${summary.passed} (${((summary.passed / summary.totalTests) * 100).toFixed(1)}%)`,
      `❌ Failed:       ${summary.failed}`,
      `⏭️  Skipped:      ${summary.skipped}`,
      `⏱️  Duration:     ${(summary.duration / 1000).toFixed(2)}s`,
      '',
    ];

    if (summary.failed > 0) {
      lines.push('═'.repeat(80));
      lines.push('⚠️  FAILURES REQUIRE ATTENTION');
      lines.push('═'.repeat(80));
      lines.push('');
      lines.push('See FAILURES.log for detailed error information');
      lines.push('');

      // Quick list of failed endpoints
      const errors = this.failures.filter(f => f.status === 'error');
      if (errors.length > 0) {
        lines.push('Failed Endpoints:');
        for (const failure of errors) {
          lines.push(`  • ${failure.endpoint} (${failure.category})`);
        }
        lines.push('');
      }
    }

    if (summary.skipped > 0) {
      lines.push('Skipped Endpoints (No Data):');
      const skipped = this.failures.filter(f => f.status === 'skipped');
      for (const failure of skipped) {
        lines.push(`  • ${failure.endpoint}`);
      }
      lines.push('');
    }

    fs.writeFileSync(summaryFile, lines.join('\n'));
    fs.writeFileSync(jsonFile, JSON.stringify(summary, null, 2));

    console.log(`📊 Summary: ${summaryFile}`);
    console.log(`📊 JSON: ${jsonFile}`);
  }

  async runAllTests(): Promise<void> {
    console.log('🚀 Starting endpoint tests (failures-only logging)...\n');
    const startTime = Date.now();

    await this.testAccountManagementApis();
    await this.testInventoryApis();
    await this.testFulfillmentApis();
    await this.testMarketingApis();
    await this.testAnalyticsApis();
    await this.testCommunicationApis();
    await this.testMetadataApis();
    await this.testTaxonomyApis();
    await this.testOtherApis();

    const totalDuration = Date.now() - startTime;
    const totalTests = this.passCount + this.failures.length;
    const failed = this.failures.filter(f => f.status === 'error').length;
    const skipped = this.failures.filter(f => f.status === 'skipped').length;

    // Generate summary
    const summary: TestSummary = {
      totalTests,
      passed: this.passCount,
      failed,
      skipped,
      duration: totalDuration,
      timestamp: new Date().toISOString(),
      failures: this.failures,
    };

    console.log('\n' + '═'.repeat(80));
    console.log('📝 Writing logs...');
    console.log('═'.repeat(80));

    this.writeFailuresLog();
    this.writeSummaryLog(summary);

    console.log('\n' + '═'.repeat(80));
    console.log('✅ TESTING COMPLETE');
    console.log('═'.repeat(80));
    console.log(`\n📊 Results:`);
    console.log(`  Total:   ${summary.totalTests}`);
    console.log(`  ✅ Pass:  ${summary.passed} (${((summary.passed / totalTests) * 100).toFixed(1)}%)`);
    console.log(`  ❌ Fail:  ${summary.failed}`);
    console.log(`  ⏭️  Skip:  ${summary.skipped}`);
    console.log(`  ⏱️  Time:  ${(totalDuration / 1000).toFixed(2)}s`);
    console.log(`\n📁 Logs: ${this.logsDir}`);

    if (failed > 0) {
      console.log(`\n⚠️  ${failed} endpoint(s) failed - check FAILURES.log for details`);
    } else {
      console.log('\n🎉 All tests passed!');
    }
    console.log('');
  }
}

// Main execution
async function main() {
  try {
    const tester = new EndpointTester();
    await tester.initialize();
    await tester.runAllTests();
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ FATAL ERROR:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
