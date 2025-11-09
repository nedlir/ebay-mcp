/**
 * Dispute API response types
 * Based on: docs/sell-apps/order-management/sell_fulfillment_v1_oas3.json
 */

import { SimpleAmount } from '../../global/global-ebay-types.js';
import { OrderLineItems } from './fulfillment-api-types.js';

export interface PaymentDispute {
  amount?: SimpleAmount;
  availableChoices?: string[];
  buyerProvided?: InfoFromBuyer;
  buyerUsername?: string;
  closedDate?: string;
  evidence?: DisputeEvidence[];
  evidenceRequests?: EvidenceRequest[];
  lineItems?: OrderLineItems[];
  monetaryTransactions?: MonetaryTransaction[];
  note?: string;
  openDate?: string;
  orderId?: string;
  paymentDisputeId?: string;
  paymentDisputeStatus?: string;
  reason?: string;
  resolution?: PaymentDisputeOutcomeDetail;
  respondByDate?: string;
  returnAddress?: ReturnAddress;
  revision?: number;
  sellerResponse?: string;
}

export interface InfoFromBuyer {
  contentOnHold?: boolean;
  note?: string;
  returnShipmentTracking?: TrackingInfo[];
}

export interface TrackingInfo {
  shipmentTrackingNumber?: string;
  shippingCarrierCode?: string;
}

export interface DisputeEvidence {
  evidenceId?: string;
  evidenceType?: string;
  files?: FileInfo[];
  lineItems?: OrderLineItems[];
  providedDate?: string;
  requestDate?: string;
  respondByDate?: string;
  shipmentTracking?: TrackingInfo[];
}

export interface FileInfo {
  fileId?: string;
  fileType?: string;
  name?: string;
  uploadedDate?: string;
}

export interface EvidenceRequest {
  evidenceId?: string;
  evidenceType?: string;
  lineItems?: OrderLineItems[];
  requestDate?: string;
  respondByDate?: string;
}

export interface MonetaryTransaction {
  date?: string;
  type?: string;
  reason?: string;
  amount?: DisputeAmount;
}

export interface DisputeAmount {
  convertedFromCurrency?: string;
  convertedFromValue?: string;
  currency?: string;
  exchangeRate?: string;
  value?: string;
}

export interface PaymentDisputeOutcomeDetail {
  fees?: SimpleAmount;
  protectedAmount?: SimpleAmount;
  protectionStatus?: string;
  reasonForClosure?: string;
  recoupAmount?: SimpleAmount;
  totalFeeCredit?: SimpleAmount;
}

export interface ReturnAddress {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  country?: string;
  county?: string;
  fullName?: string;
  postalCode?: string;
  primaryPhone?: Phone;
  stateOrProvince?: string;
}

export interface Phone {
  countryCode?: string;
  number?: string;
}

export interface PaymentDisputeActivityHistory {
  activity?: PaymentDisputeActivity[];
}

export interface PaymentDisputeActivity {
  activityDate?: string;
  activityType?: string;
  actor?: string;
}

export interface DisputeSummaryResponse {
  href?: string;
  limit?: number;
  next?: string;
  offset?: number;
  paymentDisputeSummaries?: PaymentDisputeSummary[];
  prev?: string;
  total?: number;
}

export interface PaymentDisputeSummary {
  amount?: SimpleAmount;
  buyerUsername?: string;
  closedDate?: string;
  openDate?: string;
  orderId?: string;
  paymentDisputeId?: string;
  paymentDisputeStatus?: string;
  reason?: string;
  respondByDate?: string;
}

export interface ContestPaymentDisputeRequest {
  note?: string;
  returnAddress?: ReturnAddress;
  revision?: number;
}

export interface AcceptPaymentDisputeRequest {
  returnAddress?: ReturnAddress;
  revision?: number;
}

export interface FileEvidence {
  fileId?: string;
}

export interface AddEvidencePaymentDisputeRequest {
  evidenceType?: string;
  files?: FileEvidence[];
  lineItems?: OrderLineItems[];
}

export interface AddEvidencePaymentDisputeResponse {
  evidenceId?: string;
}
