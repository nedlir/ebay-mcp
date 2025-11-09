import type {
  IssueRefundRequest,
  ShippingFulfillmentDetails,
} from '../../types/ebay/sell/order-management/fulfillment-api-types.js';
import type {
  Order,
  OrderSearchPagedCollection,
} from '../../types/ebay/sell/order-management/get-orders-response.js';
import type {
  Refund,
  ShippingFulfillment,
  ShippingFulfillmentPagedCollection,
} from '../../types/ebay/sell/order-management/shipping-fulfillment-response.js';
import { EbayApiClient } from '../client.js';

/**
 * Fulfillment API - Order processing and shipping
 * Based on: docs/sell-apps/order-management/sell_fulfillment_v1_oas3.json
 */
export class FulfillmentApi {
  private readonly basePath = '/sell/fulfillment/v1';

  constructor(private client: EbayApiClient) {}

  /**
   * Get orders for the seller
   */
  async getOrders(filter?: string, limit?: number, offset?: number): Promise<OrderSearchPagedCollection> {
    const params: Record<string, string | number> = {};
    if (filter) params.filter = filter;
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;
    return this.client.get<OrderSearchPagedCollection>(`${this.basePath}/order`, params);
  }

  /**
   * Get a specific order
   */
  async getOrder(orderId: string): Promise<Order> {
    return this.client.get<Order>(`${this.basePath}/order/${orderId}`);
  }

  /**
   * Create a shipping fulfillment
   */
  async createShippingFulfillment(
    orderId: string,
    fulfillment: ShippingFulfillmentDetails
  ): Promise<void> {
    return this.client.post<void>(
      `${this.basePath}/order/${orderId}/shipping_fulfillment`,
      fulfillment
    );
  }

  /**
   * Get shipping fulfillments for an order
   */
  async getShippingFulfillments(orderId: string): Promise<ShippingFulfillmentPagedCollection> {
    return this.client.get<ShippingFulfillmentPagedCollection>(`${this.basePath}/order/${orderId}/shipping_fulfillment`);
  }

  /**
   * Get a specific shipping fulfillment
   * @param orderId The unique identifier of the order.
   * @param fulfillmentId The unique identifier of the fulfillment.
   */
  async getShippingFulfillment(orderId: string, fulfillmentId: string): Promise<ShippingFulfillment> {
    return this.client.get<ShippingFulfillment>(
      `${this.basePath}/order/${orderId}/shipping_fulfillment/${fulfillmentId}`
    );
  }

  /**
   * Issue a refund
   */
  async issueRefund(orderId: string, refund: IssueRefundRequest): Promise<Refund> {
    return this.client.post<Refund>(`${this.basePath}/order/${orderId}/issue_refund`, refund);
  }
}
