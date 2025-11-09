import { EbayApiClient } from '../client.js';

/**
 * Analytics API - Sales and traffic analytics
 * Based on: docs/sell-apps/analytics-and-report/sell_analytics_v1_oas3.json
 */
export class AnalyticsApi {
  private readonly basePath = '/sell/analytics/v1';

  constructor(private client: EbayApiClient) {}

  /**
   * Get traffic report for listings
   */
  async getTrafficReport(
    dimension: string,
    filter: string,
    metric: string,
    sort?: string
  ) {
    const params: any = {
      dimension,
      filter,
      metric
    };
    if (sort) params.sort = sort;
    return this.client.get(`${this.basePath}/traffic_report`, params);
  }

  /**
   * Get seller standards profile
   */
  async getSellerStandardsProfile(program?: string, cycle?: string) {
    const params: any = {};
    if (program) params.program = program;
    if (cycle) params.cycle = cycle;
    return this.client.get(`${this.basePath}/seller_standards_profile`, params);
  }

  /**
   * Get customer service metrics
   */
  async getCustomerServiceMetric(
    customerServiceMetricType: string,
    evaluationMarketplaceId: string,
    evaluationType: string
  ) {
    const params = {
      customer_service_metric_type: customerServiceMetricType,
      evaluation_marketplace_id: evaluationMarketplaceId,
      evaluation_type: evaluationType
    };
    return this.client.get(`${this.basePath}/customer_service_metric`, params);
  }
}
