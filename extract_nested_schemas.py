#!/usr/bin/env python3
import json

# Load the OpenAPI spec
with open('/Applications/Github/ebay-api-mcp-server/docs/sell-apps/account-management/sell_account_v1_oas3.json', 'r') as f:
    spec = json.load(f)

schemas = spec.get('components', {}).get('schemas', {})

# Find all referenced schemas recursively
def find_all_refs(obj, refs_set):
    """Recursively find all $ref references"""
    if isinstance(obj, dict):
        if '$ref' in obj:
            ref = obj['$ref']
            if ref.startswith('#/components/schemas/'):
                schema_name = ref.split('/')[-1]
                refs_set.add(schema_name)
        for value in obj.values():
            find_all_refs(value, refs_set)
    elif isinstance(obj, list):
        for item in obj:
            find_all_refs(item, refs_set)

# Start with the main schemas
initial_schemas = {
    'CustomPolicy', 'CustomPolicyCreateRequest', 'CustomPolicyRequest', 'CustomPolicyResponse',
    'FulfillmentPolicy', 'FulfillmentPolicyRequest', 'FulfillmentPolicyResponse',
    'PaymentPolicy', 'PaymentPolicyRequest', 'PaymentPolicyResponse',
    'ReturnPolicy', 'ReturnPolicyRequest', 'ReturnPolicyResponse',
    'SellingPrivileges', 'SetFulfillmentPolicyResponse', 'SetPaymentPolicyResponse', 'SetReturnPolicyResponse'
}

# Recursively find all dependent schemas
all_schemas = set(initial_schemas)
to_process = list(initial_schemas)

while to_process:
    schema_name = to_process.pop(0)
    if schema_name in schemas:
        schema = schemas[schema_name]
        refs = set()
        find_all_refs(schema, refs)
        for ref in refs:
            if ref not in all_schemas:
                all_schemas.add(ref)
                to_process.append(ref)

print("=" * 80)
print("ALL REFERENCED SCHEMAS (INCLUDING NESTED)")
print("=" * 80)
print(f"\nTotal schemas: {len(all_schemas)}\n")

for schema_name in sorted(all_schemas):
    print(f"  - {schema_name}")

print("\n\n" + "=" * 80)
print("DETAILED NESTED SCHEMA DEFINITIONS")
print("=" * 80)

# Print all schemas with full details
for schema_name in sorted(all_schemas):
    if schema_name not in schemas:
        print(f"\nWARNING: Schema {schema_name} not found in components/schemas")
        continue

    schema = schemas[schema_name]
    print(f"\n{'-' * 80}")
    print(f"SCHEMA: {schema_name}")
    print(f"{'-' * 80}")

    schema_type = schema.get('type', 'unknown')
    description = schema.get('description', '')

    print(f"Type: {schema_type}")
    if description:
        print(f"Description: {description}")

    # Properties
    properties = schema.get('properties', {})
    if properties:
        print("\nProperties:")
        required = schema.get('required', [])
        for prop_name, prop_spec in sorted(properties.items()):
            prop_type = prop_spec.get('type', 'unknown')
            prop_ref = prop_spec.get('$ref', '')
            prop_desc = prop_spec.get('description', '')
            prop_format = prop_spec.get('format', '')
            prop_enum = prop_spec.get('enum', [])
            is_required = prop_name in required

            if prop_ref:
                ref_name = prop_ref.split('/')[-1]
                print(f"\n  {prop_name}: {ref_name} {'(required)' if is_required else '(optional)'}")
            elif prop_type == 'array':
                items = prop_spec.get('items', {})
                items_ref = items.get('$ref', '')
                if items_ref:
                    items_name = items_ref.split('/')[-1]
                    print(f"\n  {prop_name}: array of {items_name} {'(required)' if is_required else '(optional)'}")
                else:
                    items_type = items.get('type', 'unknown')
                    items_format = items.get('format', '')
                    type_str = f"{items_type}({items_format})" if items_format else items_type
                    print(f"\n  {prop_name}: array of {type_str} {'(required)' if is_required else '(optional)'}")
            else:
                type_str = f"{prop_type}({prop_format})" if prop_format else prop_type
                print(f"\n  {prop_name}: {type_str} {'(required)' if is_required else '(optional)'}")

            if prop_desc:
                # Wrap description
                import textwrap
                wrapped = textwrap.fill(prop_desc, width=76, initial_indent="    ", subsequent_indent="    ")
                print(wrapped)

            if prop_enum:
                print(f"    Enum: {', '.join(prop_enum)}")

    # Enum values at schema level
    enum_values = schema.get('enum', [])
    if enum_values:
        print(f"\nEnum values: {', '.join(enum_values)}")

    # Additional properties
    additional_props = schema.get('additionalProperties', None)
    if additional_props is not None:
        print(f"\nAdditional properties: {additional_props}")

print("\n\n" + "=" * 80)
print("END OF NESTED SCHEMA EXTRACTION")
print("=" * 80)
