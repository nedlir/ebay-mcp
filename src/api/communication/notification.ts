import { EbayApiClient } from '../client.js';

/**
 * Notification API - Event notifications and subscriptions
 * Based on: docs/sell-apps/communication/commerce_notification_v1_oas3.json
 */
export class NotificationApi {
  private readonly basePath = '/commerce/notification/v1';

  constructor(private client: EbayApiClient) {}

  /**
   * Get public key for validating notifications
   */
  async getPublicKey(publicKeyId: string) {
    return this.client.get(`${this.basePath}/public_key/${publicKeyId}`);
  }

  /**
   * Get notification config
   */
  async getConfig() {
    return this.client.get(`${this.basePath}/config`);
  }

  /**
   * Update notification config
   */
  async updateConfig(config: Record<string, unknown>) {
    return this.client.put(`${this.basePath}/config`, config);
  }

  /**
   * Get destination
   */
  async getDestination(destinationId: string) {
    return this.client.get(`${this.basePath}/destination/${destinationId}`);
  }

  /**
   * Create destination
   */
  async createDestination(destination: Record<string, unknown>) {
    return this.client.post(`${this.basePath}/destination`, destination);
  }

  /**
   * Update destination
   */
  async updateDestination(destinationId: string, destination: Record<string, unknown>) {
    return this.client.put(`${this.basePath}/destination/${destinationId}`, destination);
  }

  /**
   * Delete destination
   */
  async deleteDestination(destinationId: string) {
    return this.client.delete(`${this.basePath}/destination/${destinationId}`);
  }
}
