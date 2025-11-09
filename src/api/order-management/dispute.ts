import type { PaymentDispute } from "../../types/ebay/sell/order-management/dispute-types.js";
import type { EbayApiClient } from "../client.js";

/**
 * Dispute API - Manage payment disputes
 * Based on: docs/sell-apps/order-management/sell_fulfillment_v1_oas3.json
 */
export class DisputeApi {
  private readonly basePath = "/sell/fulfillment/v1";

  constructor(private client: EbayApiClient) { }

  /**
   * Get payment dispute details
   */
  async getPaymentDispute(paymentDisputeId: string): Promise<PaymentDispute> {
    return this.client.get<PaymentDispute>(
      `${this.basePath}/payment_dispute/${paymentDisputeId}`,
    );
  }

  /**
   * Get payment dispute evidence file
   */
  async fetchEvidenceContent(
    paymentDisputeId: string,
    evidenceId: string,
    fileId: string
  ): Promise<ArrayBuffer> {
    const params: Record<string, string> = {
      evidence_id: evidenceId,
      file_id: fileId,
    };
    return this.client.get<ArrayBuffer>(
      `${this.basePath}/payment_dispute/${paymentDisputeId}/fetch_evidence_content`,
      params
    );
  }

  /**
   * Get payment dispute activity
   */
  async getActivities(paymentDisputeId: string): Promise<PaymentDisputeActivityHistory> {
    return this.client.get<PaymentDisputeActivityHistory>(
      `${this.basePath}/payment_dispute/${paymentDisputeId}/activity`
    );
  }

  /**
   * Search for payment disputes
   */
  async getPaymentDisputeSummaries(params?: {
    order_id?: string;
    buyer_username?: string;
    open_date_from?: string;
    open_date_to?: string;
    payment_dispute_status?: string;
    limit?: number;
    offset?: number;
  }): Promise<DisputeSummaryResponse> {
    return this.client.get<DisputeSummaryResponse>(`${this.basePath}/payment_dispute_summary`, params);
  }

  /**
   * Contest a payment dispute
   */
  async contestPaymentDispute(
    paymentDisputeId: string,
    body?: ContestPaymentDisputeRequest
  ): Promise<void> {
    return this.client.post<void>(
      `${this.basePath}/payment_dispute/${paymentDisputeId}/contest`,
      body
    );
  }

  /**
   * Accept a payment dispute
   */
  async acceptPaymentDispute(
    paymentDisputeId: string,
    body?: AcceptPaymentDisputeRequest
  ): Promise<void> {
    return this.client.post<void>(
      `${this.basePath}/payment_dispute/${paymentDisputeId}/accept`,
      body
    );
  }

  /**
   * Upload an evidence file
   */
  async uploadEvidenceFile(
    paymentDisputeId: string,
    body: ArrayBuffer
  ): Promise<FileEvidence> {
    return this.client.post<FileEvidence>(
      `${this.basePath}/payment_dispute/${paymentDisputeId}/upload_evidence_file`,
      body,
      { 'Content-Type': 'multipart/form-data' }
    );
  }

  /**
   * Add an evidence file
   */
  async addEvidence(
    paymentDisputeId: string,
    body: AddEvidencePaymentDisputeRequest
  ): Promise<AddEvidencePaymentDisputeResponse> {
    return this.client.post<AddEvidencePaymentDisputeResponse>(
      `${this.basePath}/payment_dispute/${paymentDisputeId}/add_evidence`,
      body
    );
  }

  /**
   * Update an evidence file
   */
  async updateEvidence(
    paymentDisputeId: string,
    body: UpdateEvidencePaymentDisputeRequest
  ): Promise<void> {
    return this.client.post<void>(
      `${this.basePath}/payment_dispute/${paymentDisputeId}/update_evidence`,
      body
    );
  }
}
