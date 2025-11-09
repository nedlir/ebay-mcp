import { EbayApiClient } from '../client.js';

/**
 * VERO API - Verified Rights Owner program
 * Based on: docs/sell-apps/other-apis/commerce_vero_v1_oas3.json
 */
export class VeroApi {
  private readonly basePath = '/commerce/vero/v1';

  constructor(private client: EbayApiClient) {}

  /**
   * Report infringement
   */
  async reportInfringement(infringementData: Record<string, unknown>) {
    return this.client.post(`${this.basePath}/report_infringement`, infringementData);
  }

  /**
   * Get reported items
   */
  async getReportedItems(filter?: string, limit?: number, offset?: number) {
    const params: Record<string, string | number> = {};
    if (filter) params.filter = filter;
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;
    return this.client.get(`${this.basePath}/reported_item`, params);
  }
}
