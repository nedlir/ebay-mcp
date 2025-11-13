# Other APIs

## Completed

### VERO API (`vero.ts`) - ✅ All endpoints implemented (v1.1.5)

- [x] `createVeroReport` - Create VERO report for IP infringement
- [x] `getVeroReport` - Get specific VERO report by ID
- [x] `getVeroReportItems` - Get all report items with pagination
- [x] `getVeroReasonCode` - Get specific reason code by ID
- [x] `getVeroReasonCodes` - Get all available reason codes
- [x] Unit tests added
- [x] MCP tools added (5 tools)
- [x] Zod schemas added

### eDelivery API (`edelivery.ts`) - ✅ All endpoints implemented (v1.2.1)

**Cost & Preferences:**

- [x] `getActualCosts` - GET /actual_costs
- [x] `getAddressPreferences` - GET /address_preference
- [x] `createAddressPreference` - POST /address_preference
- [x] `getConsignPreferences` - GET /consign_preference
- [x] `createConsignPreference` - POST /consign_preference

**Agents & Services:**

- [x] `getAgents` - GET /agents
- [x] `getBatteryQualifications` - GET /battery_qualifications
- [x] `getDropoffSites` - GET /dropoff_sites
- [x] `getShippingServices` - GET /services

**Bundles:**

- [x] `createBundle` - POST /bundle
- [x] `getBundle` - GET /bundle/{bundle_id}
- [x] `cancelBundle` - POST /bundle/{bundle_id}/cancel
- [x] `getBundleLabel` - GET /bundle/{bundle_id}/label

**Packages (Single):**

- [x] `createPackage` - POST /package
- [x] `getPackage` - GET /package/{package_id}
- [x] `deletePackage` - DELETE /package/{package_id}
- [x] `getPackageByOrderLineItem` - GET /package/{order_line_item_id}/item
- [x] `cancelPackage` - POST /package/{package_id}/cancel
- [x] `clonePackage` - POST /package/{package_id}/clone
- [x] `confirmPackage` - POST /package/{package_id}/confirm

**Packages (Bulk):**

- [x] `bulkCancelPackages` - POST /package/bulk_cancel_packages
- [x] `bulkConfirmPackages` - POST /package/bulk_confirm_packages
- [x] `bulkDeletePackages` - POST /package/bulk_delete_packages

**Labels & Tracking:**

- [x] `getLabels` - GET /labels
- [x] `getHandoverSheet` - GET /handover_sheet
- [x] `getTracking` - GET /tracking

**Other:**

- [x] `createComplaint` - POST /complaint
- [x] Unit tests added (24 tests)

**Note:** Existing `createShippingQuote` and `getShippingQuote` are NOT part of the eDelivery spec above. They appear to be from a different API version or spec file.

## Future Improvements

- **MCP Tools:** Add tool definitions and Zod schemas for all eDelivery endpoints (currently pending)
