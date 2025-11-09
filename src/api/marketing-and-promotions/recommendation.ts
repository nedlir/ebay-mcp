import { EbayApiClient } from '../client.js';

/**
 * Recommendation API - Listing recommendations
 * Based on: docs/sell-apps/marketing-and-promotions/sell_recommendation_v1_oas3.json
 */
export class RecommendationApi {
  private readonly basePath = '/sell/recommendation/v1';

  constructor(private client: EbayApiClient) {}

  /**
   * Get listing recommendations
   */
  async getListingRecommendations(
    filter?: string,
    limit?: number,
    offset?: number
  ) {
    const params: Record<string, string | number> = {};
    if (filter) params.filter = filter;
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;
    return this.client.get(`${this.basePath}/find`, params);
  }

  /**
   * Get item recommendations (e.g., recommended aspects)
   */
  async getItemRecommendations(listingIds: string[], xEbayCMarketplaceId: string) {
    return this.client.post(
      `${this.basePath}/item_recommendation`,
      { listingIds },
      {
        headers: {
          'X-EBAY-C-MARKETPLACE-ID': xEbayCMarketplaceId
        }
      }
    );
  }
}
