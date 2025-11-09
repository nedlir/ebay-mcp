# Listing Metadata API - TODO

This file outlines the tasks for completing the implementation of the Listing Metadata API.

## Discrepancy with `taxonomy.ts`

The `taxonomy.ts` file appears to be using a different API (`/commerce/taxonomy/v1`) than the one defined in the OpenAPI specification (`/sell/metadata/v1`). The OpenAPI specification does not contain any of the endpoints implemented in `taxonomy.ts`. This needs to be investigated and corrected.

## Missing Endpoints

The following endpoints are defined in the OpenAPI specification but are not yet implemented in the server:

- `GET /marketplace/{marketplace_id}/get_classified_ad_policies`
- `GET /marketplace/{marketplace_id}/get_currencies`
- `GET /marketplace/{marketplace_id}/get_listing_type_policies`
- `GET /marketplace/{marketplace_id}/get_motors_listing_policies`
- `GET /marketplace/{marketplace_id}/get_shipping_policies`
- `GET /marketplace/{marketplace_id}/get_site_visibility_policies`
- `POST /compatibilities/get_compatibilities_by_specification`
- `POST /compatibilities/get_compatibility_property_names`
- `POST /compatibilities/get_compatibility_property_values`

## Improvements

- **Input Validation:** Add input validation to all endpoints to ensure that the data sent by the AI client is valid.
- **Error Handling:** Improve error handling to provide more detailed and structured error messages to the AI client.
- **Testing:** Add unit tests for all endpoints.