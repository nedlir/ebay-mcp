import { EbayApiClient } from '../client.js';

/**
 * Identity API - User identity verification
 * Based on: docs/sell-apps/other-apis/commerce_identity_v1_oas3.json
 */
export class IdentityApi {
  private readonly basePath = '/commerce/identity/v1';

  constructor(private client: EbayApiClient) {}

  /**
   * Get user information
   */
  async getUser() {
    return this.client.get(`${this.basePath}/user`);
  }
}
