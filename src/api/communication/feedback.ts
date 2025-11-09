import { EbayApiClient } from '../client.js';

/**
 * Feedback API - Manage buyer and seller feedback
 * Based on: docs/sell-apps/communication/commerce_feedback_v1_beta_oas3.json
 */
export class FeedbackApi {
  private readonly basePath = '/commerce/feedback/v1';

  constructor(private client: EbayApiClient) {}

  /**
   * Get feedback for a transaction
   */
  async getFeedback(transactionId: string) {
    return this.client.get(`${this.basePath}/feedback/${transactionId}`);
  }

  /**
   * Leave feedback for a buyer
   */
  async leaveFeedbackForBuyer(feedbackData: Record<string, unknown>) {
    return this.client.post(`${this.basePath}/feedback`, feedbackData);
  }

  /**
   * Get feedback summary
   */
  async getFeedbackSummary() {
    return this.client.get(`${this.basePath}/feedback_summary`);
  }
}
