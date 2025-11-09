import { EbayApiClient } from '../client.js';

/**
 * eDelivery API - International shipping eDelivery
 * Based on: docs/sell-apps/other-apis/sell_edelivery_international_shipping_oas3.json
 */
export class EDeliveryApi {
  private readonly basePath = '/sell/logistics/v1';

  constructor(private client: EbayApiClient) {}

  /**
   * Create shipping quote
   */
  async createShippingQuote(shippingQuoteRequest: Record<string, unknown>) {
    return this.client.post(`${this.basePath}/shipping_quote`, shippingQuoteRequest);
  }

  /**
   * Get shipping quote
   */
  async getShippingQuote(shippingQuoteId: string) {
    return this.client.get(`${this.basePath}/shipping_quote/${shippingQuoteId}`);
  }
}
