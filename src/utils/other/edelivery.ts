import { z } from "zod";

/**
 * Zod schemas for eDelivery API input validation
 * Based on: src/api/other/edelivery.ts
 * OpenAPI spec: docs/sell-apps/other-apis/sell_edelivery_international_shipping_oas3.json
 * Types from: src/types/sell_edelivery_international_shipping_oas3.ts
 *
 * Note: The eDelivery API is only available for Greater-China based sellers with an active eDIS account.
 */

// Reusable schema for ID parameters
const idSchema = (name: string, description: string) =>
  z.string({
    message: `${name} is required`,
    required_error: `${name.toLowerCase().replace(/\s+/g, '_')} is required`,
    invalid_type_error: `${name.toLowerCase().replace(/\s+/g, '_')} must be a string`,
    description
  });

/**
 * Schema for createShippingQuote method
 * Endpoint: POST /shipping_quote
 * Body: ShippingQuoteRequest - complex object with shipping details
 */
export const createShippingQuoteSchema = z.object({
  shipping_quote_request: z.record(z.unknown(), {
    message: "Shipping quote request data is required",
    required_error: "shipping_quote_request is required",
    invalid_type_error: "shipping_quote_request must be an object",
    description: "The shipping quote request containing shipment details, addresses, and package information"
  })
});

/**
 * Schema for getShippingQuote method
 * Endpoint: GET /shipping_quote/{shipping_quote_id}
 * Path: shipping_quote_id (required)
 */
export const getShippingQuoteSchema = z.object({
  shipping_quote_id: idSchema("Shipping quote ID", "The unique identifier for the shipping quote")
});
