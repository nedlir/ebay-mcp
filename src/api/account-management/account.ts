import type { CustomPolicyResponse } from "../../types/ebay/sell/accountManagement/accountV1/custom-policy/get-custom-policies.js";
import type { CustomPolicy } from "../../types/ebay/sell/accountManagement/accountV1/custom-policy/get-custom-policy.js";
import type { FulfillmentPolicyResponse } from "../../types/ebay/sell/accountManagement/accountV1/fulfillment-policy/get-fulfillment-policies.js";
import type { GetPaymentPoliciesResponse } from "../../types/ebay/sell/accountManagement/accountV1/payment-policy/get-payment-policies.js";
import type { SellingPrivileges } from "../../types/ebay/sell/accountManagement/accountV1/privilege/get-privileges.js";
import type { ReturnPolicyResponse } from "../../types/ebay/sell/accountManagement/accountV1/return-policy/get-return-policies.js";
import type { EbayApiClient } from "../client.js";

/**
 * Account API - Seller account configuration, policies, programs
 * Based on: docs/sell-apps/account-management/sell_account_v1_oas3.json
 */
export class AccountApi {
  private readonly basePath = "/sell/account/v1";

  constructor(private client: EbayApiClient) { }

  /**
   * Get custom policies for the seller
   */
  async getCustomPolicies(policyTypes?: string): Promise<CustomPolicyResponse> {
    const params = policyTypes ? { policy_types: policyTypes } : undefined;
    return this.client.get<CustomPolicyResponse>(
      `${this.basePath}/custom_policy`,
      params,
    );
  }

  /**
   * Get a specific custom policy
   */
  async getCustomPolicy(customPolicyId: string): Promise<CustomPolicy> {
    return this.client.get<CustomPolicy>(`${this.basePath}/custom_policy/${customPolicyId}`);
  }

  /**
   * Get fulfillment policies
   */
  async getFulfillmentPolicies(
    marketplaceId?: string,
  ): Promise<FulfillmentPolicyResponse> {
    const params = marketplaceId
      ? { marketplace_id: marketplaceId }
      : undefined;
    return this.client.get<FulfillmentPolicyResponse>(
      `${this.basePath}/fulfillment_policy`,
      params,
    );
  }

  /**
   * Get payment policies
   */
  async getPaymentPolicies(
    marketplaceId?: string,
  ): Promise<GetPaymentPoliciesResponse> {
    const params = marketplaceId
      ? { marketplace_id: marketplaceId }
      : undefined;
    return this.client.get<GetPaymentPoliciesResponse>(
      `${this.basePath}/payment_policy`,
      params,
    );
  }

  /**
   * Get return policies
   */
  async getReturnPolicies(
    marketplaceId?: string,
  ): Promise<ReturnPolicyResponse> {
    const params = marketplaceId
      ? { marketplace_id: marketplaceId }
      : undefined;
    return this.client.get<ReturnPolicyResponse>(
      `${this.basePath}/return_policy`,
      params,
    );
  }

  /**
   * Get seller account privileges
   */
  async getPrivileges(): Promise<SellingPrivileges> {
    return this.client.get<SellingPrivileges>(`${this.basePath}/privilege`);
  }
}
