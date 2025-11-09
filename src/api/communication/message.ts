import { EbayApiClient } from '../client.js';

/**
 * Message API - Buyer-seller messaging
 * Based on: docs/sell-apps/communication/commerce_message_v1_oas3.json
 */
export class MessageApi {
  private readonly basePath = '/commerce/message/v1';

  constructor(private client: EbayApiClient) {}

  /**
   * Search for messages
   */
  async searchMessages(filter?: string, limit?: number, offset?: number) {
    const params: Record<string, string | number> = {};
    if (filter) params.filter = filter;
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;
    return this.client.get(`${this.basePath}/search`, params);
  }

  /**
   * Get a specific message
   */
  async getMessage(messageId: string) {
    return this.client.get(`${this.basePath}/${messageId}`);
  }

  /**
   * Reply to a message
   */
  async replyToMessage(messageId: string, messageContent: string) {
    return this.client.post(`${this.basePath}/${messageId}/reply`, {
      messageContent
    });
  }
}
