/**
 * eBay Fulfillment API Type Definitions
 * Based on: docs/sell-apps/order-management/sell_fulfillment_v1_oas3.json
 */

/**
 * This type defines the monetary value and currency.
 */
export interface SimpleAmount {
  /**
   * A three-letter ISO 4217 code (such as USD for US site) that indicates the currency of the amount in the value field.
   */
  currency?: string;
  /**
   * The monetary amount.
   */
  value?: string;
}

/**
 * This type identifies the line item and quantity of that line item that comprises one fulfillment, such as a shipping package.
 */
export interface LineItemReference {
  /**
   * This is the unique identifier of the eBay order line item that is part of the shipping fulfillment.
   */
  lineItemId?: string;
  /**
   * This is the number of lineItems associated with the trackingNumber specified by the seller.
   * This must be a whole number greater than zero (0).
   * Default: 1
   */
  quantity?: number;
}

/**
 * This type contains the details for creating a fulfillment for an order.
 */
export interface ShippingFulfillmentDetails {
  /**
   * This array contains a list of one or more line items and the quantity that will be shipped in the same package.
   */
  lineItems?: LineItemReference[];
  /**
   * This is the actual date and time that the fulfillment package was shipped.
   * This timestamp is in ISO 8601 format, which uses the 24-hour Universal Coordinated Time (UTC) clock.
   * Format: [YYYY]-[MM]-[DD]T[hh]:[mm]:[ss].[sss]Z
   * Example: 2015-08-04T19:09:02.768Z
   * Default: The current date and time.
   */
  shippedDate?: string;
  /**
   * The unique identifier of the shipping carrier being used to ship the line item(s).
   */
  shippingCarrierCode?: string;
  /**
   * The tracking number provided by the shipping carrier for this fulfillment.
   * Only alphanumeric characters are supported. Spaces, hyphens, and all other special characters are not supported.
   */
  trackingNumber?: string;
}

/**
 * Legacy reference container for identifying order line items using item ID/transaction ID pair.
 */
export interface LegacyReference {
  /**
   * The unique identifier of the eBay listing.
   */
  legacyItemId?: string;
  /**
   * The unique identifier of a transaction in the eBay system.
   */
  legacyTransactionId?: string;
}

/**
 * This type is used if the seller is issuing a refund for one or more individual order line items in a multiple line item order.
 */
export interface RefundItem {
  /**
   * This container is used to specify the amount of the refund for the corresponding order line item.
   */
  refundAmount?: SimpleAmount;
  /**
   * The unique identifier of an order line item.
   */
  lineItemId?: string;
  /**
   * This container is needed if the seller is issuing a refund for an individual order line item,
   * and wishes to use an item ID/transaction ID pair to identify the order line item.
   */
  legacyReference?: LegacyReference;
}

/**
 * The base type used by the request payload of the issueRefund method.
 */
export interface IssueRefundRequest {
  /**
   * The enumeration value passed into this field indicates the reason for the refund.
   * This field is required.
   * Possible values: BUYER_CANCEL, ITEM_NOT_RECEIVED, ITEM_NOT_AS_DESCRIBED, etc.
   */
  reasonForRefund: string;
  /**
   * This free-text field allows the seller to clarify why the refund is being issued to the buyer.
   * Max Length: 100
   */
  comment?: string;
  /**
   * The refundItems array is only required if the seller is issuing a refund for one or more individual order line items
   * in a multiple line item order. Otherwise, the seller just uses the orderLevelRefundAmount container.
   */
  refundItems?: RefundItem[];
  /**
   * This container is used to specify the amount of the refund for the entire order.
   */
  orderLevelRefundAmount?: SimpleAmount;
}
