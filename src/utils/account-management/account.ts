import { z } from "zod";

export const getCustomPoliciesSchema = z.object({
  policy_types: z.string().optional(),
});

export const getCustomPolicySchema = z.object({
  custom_policy_id: z.string(),
});

export const getFulfillmentPoliciesSchema = z.object({
  marketplace_id: z.string().optional(),
});

export const getPaymentPoliciesSchema = z.object({
  marketplace_id: z.string({ message: 'Marketplace ID is required', required_error: 'marketplace_id is required', invalid_type_error: 'marketplace_id must be a string', description: 'Marketplace ID' }).optional(),
});

export const getReturnPoliciesSchema = z.object({
  marketplace_id: z.string().optional(),
});

export const getPrivilegesSchema = z.object({});

export const getFulfillmentPolicySchema = z.object({
  fulfillmentPolicyId: z.string(),
});

export const getFulfillmentPolicyByNameSchema = z.object({
  marketplace_id: z.string(),
  name: z.string(),
});

export const getPaymentPolicySchema = z.object({
  payment_policy_id: z.string(),
});

export const getPaymentPolicyByNameSchema = z.object({
  marketplace_id: z.string(),
  name: z.string(),
});

export const getReturnPolicySchema = z.object({
  return_policy_id: z.string(),
});

export const getReturnPolicyByNameSchema = z.object({
  marketplace_id: z.string(),
  name: z.string(),
});

export const getKycSchema = z.object({});

export const getPaymentsProgramStatusSchema = z.object({
  marketplace_id: z.string(),
  payments_program_type: z.string(),
});

export const getRateTablesSchema = z.object({});

export const getSalesTaxSchema = z.object({
  countryCode: z.string(),
  jurisdictionId: z.string(),
});

export const getSalesTaxesSchema = z.object({
  country_code: z.string().optional(),
});

export const getSubscriptionSchema = z.object({
  limit: z.string().optional(),
});

export const getOptedInProgramsSchema = z.object({});
