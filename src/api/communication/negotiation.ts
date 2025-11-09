import { EbayApiClient } from '../client.js';

/**
 * Negotiation API - Buyer-seller negotiations and offers
 * Based on: docs/sell-apps/communication/sell_negotiation_v1_oas3.json
 */
export class NegotiationApi {
  private readonly basePath = '/sell/negotiation/v1';

  constructor(private client: EbayApiClient) {}

  /**
   * Get offers to buyers (Best Offers)
   */
  async getOffersToBuyers(filter?: string, limit?: number, offset?: number) {
    const params: Record<string, string | number> = {};
    if (filter) params.filter = filter;
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;
    return this.client.get(`${this.basePath}/offer`, params);
  }

  /**
   * Send offer to interested buyers
   */
  async sendOfferToInterestedBuyers(offerId: string, offerData: Record<string, unknown>) {
    return this.client.post(
      `${this.basePath}/send_offer_to_interested_buyers`,
      { offerId, ...offerData }
    );
  }
}
