# Listing Management API - TODO

This file outlines the tasks for completing the implementation of the Listing Management API.

## Missing Endpoints

The following endpoints are defined in the OpenAPI specification but are not yet implemented in the server:

- `POST /bulk_create_or_replace_inventory_item`
- `POST /bulk_get_inventory_item`
- `POST /bulk_update_price_quantity`
- `GET /inventory_item/{sku}/product_compatibility`
- `PUT /inventory_item/{sku}/product_compatibility`
- `DELETE /inventory_item/{sku}/product_compatibility`
- `GET /inventory_item_group/{inventoryItemGroupKey}`
- `PUT /inventory_item_group/{inventoryItemGroupKey}`
- `DELETE /inventory_item_group/{inventoryItemGroupKey}`
- `GET /location`
- `POST /location/bulk_create_inventory_location`
- `POST /location/bulk_delete_inventory_location`
- `POST /location/{merchantLocationKey}/disable`
- `POST /location/{merchantLocationKey}/enable`
- `GET /location/{merchantLocationKey}`
- `POST /location/{merchantLocationKey}/update_location_details`
- `DELETE /location/{merchantLocationKey}`
- `GET /offer/{offerId}`
- `PUT /offer/{offerId}`
- `DELETE /offer/{offerId}`
- `POST /offer/bulk_create_offer`
- `POST /offer/bulk_publish`
- `GET /offer/get_listing_fees`
- `POST /offer/{offerId}/withdraw`
- `POST /listing/migrate`
- `POST /bulk_migrate_listing`

## Improvements

- **Input Validation:** Add input validation to all endpoints to ensure that the data sent by the AI client is valid.
- **Error Handling:** Improve error handling to provide more detailed and structured error messages to the AI client.
- **Testing:** Add unit tests for all endpoints.