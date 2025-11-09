#!/usr/bin/env python3
import json
import sys

# Load the OpenAPI spec
with open('/Applications/Github/ebay-api-mcp-server/docs/sell-apps/account-management/sell_account_v1_oas3.json', 'r') as f:
    spec = json.load(f)

# Define the endpoints we want to extract
target_endpoints = {
    '/custom_policy/': ['get', 'post'],
    '/custom_policy/{custom_policy_id}': ['get', 'put', 'delete'],
    '/fulfillment_policy': ['get', 'post'],
    '/fulfillment_policy/{fulfillmentPolicyId}': ['get', 'put', 'delete'],
    '/fulfillment_policy/get_by_policy_name': ['get'],
    '/payment_policy': ['get', 'post'],
    '/payment_policy/{payment_policy_id}': ['get', 'put', 'delete'],
    '/payment_policy/get_by_policy_name': ['get'],
    '/return_policy': ['get', 'post'],
    '/return_policy/{return_policy_id}': ['get', 'put', 'delete'],
    '/return_policy/get_by_policy_name': ['get'],
    '/privilege': ['get']
}

paths = spec.get('paths', {})
schemas = spec.get('components', {}).get('schemas', {})

print("=" * 80)
print("EBAY SELL ACCOUNT API v1 - ENDPOINT SPECIFICATIONS")
print("=" * 80)
print()

# Extract endpoint details
for path, methods in target_endpoints.items():
    if path not in paths:
        print(f"WARNING: Path {path} not found in spec")
        continue

    path_spec = paths[path]

    print(f"\n{'=' * 80}")
    print(f"PATH: {path}")
    print(f"{'=' * 80}")

    for method in methods:
        if method not in path_spec:
            print(f"  WARNING: Method {method.upper()} not found for {path}")
            continue

        operation = path_spec[method]
        operation_id = operation.get('operationId', 'unknown')
        description = operation.get('description', 'No description')
        summary = operation.get('summary', 'No summary')

        print(f"\n{method.upper()} {path}")
        print(f"Operation ID: {operation_id}")
        print(f"Summary: {summary}")
        print(f"Description: {description[:200]}..." if len(description) > 200 else f"Description: {description}")

        # Parameters
        params = operation.get('parameters', [])
        if params:
            print("\nPARAMETERS:")
            for param in params:
                param_name = param.get('name', 'unknown')
                param_in = param.get('in', 'unknown')
                param_required = param.get('required', False)
                param_schema = param.get('schema', {})
                param_type = param_schema.get('type', 'unknown')
                param_desc = param.get('description', '')

                print(f"  - {param_name} ({param_in})")
                print(f"    Type: {param_type}")
                print(f"    Required: {param_required}")
                if param_desc:
                    print(f"    Description: {param_desc[:100]}..." if len(param_desc) > 100 else f"    Description: {param_desc}")

        # Request Body
        request_body = operation.get('requestBody', {})
        if request_body:
            print("\nREQUEST BODY:")
            content = request_body.get('content', {})
            for content_type, content_spec in content.items():
                schema = content_spec.get('schema', {})
                ref = schema.get('$ref', '')
                if ref:
                    schema_name = ref.split('/')[-1]
                    print(f"  Content-Type: {content_type}")
                    print(f"  Schema: {schema_name}")
                else:
                    print(f"  Content-Type: {content_type}")
                    print(f"  Schema: {json.dumps(schema, indent=4)}")

        # Responses
        responses = operation.get('responses', {})
        if responses:
            print("\nRESPONSES:")
            for status_code, response_spec in responses.items():
                response_desc = response_spec.get('description', '')
                print(f"  {status_code}: {response_desc}")

                content = response_spec.get('content', {})
                for content_type, content_spec in content.items():
                    schema = content_spec.get('schema', {})
                    ref = schema.get('$ref', '')
                    if ref:
                        schema_name = ref.split('/')[-1]
                        print(f"    Content-Type: {content_type}")
                        print(f"    Schema: {schema_name}")
                    elif schema:
                        print(f"    Content-Type: {content_type}")
                        print(f"    Schema Type: {schema.get('type', 'unknown')}")

print("\n\n" + "=" * 80)
print("COMPONENT SCHEMAS")
print("=" * 80)

# Collect all referenced schemas
referenced_schemas = set()

def find_refs(obj, refs_set):
    """Recursively find all $ref references"""
    if isinstance(obj, dict):
        if '$ref' in obj:
            ref = obj['$ref']
            if ref.startswith('#/components/schemas/'):
                schema_name = ref.split('/')[-1]
                refs_set.add(schema_name)
        for value in obj.values():
            find_refs(value, refs_set)
    elif isinstance(obj, list):
        for item in obj:
            find_refs(item, refs_set)

# Find all schemas referenced by our target endpoints
for path, methods in target_endpoints.items():
    if path in paths:
        find_refs(paths[path], referenced_schemas)

# Recursively find schemas referenced by other schemas
def expand_schema_refs(schema_name, all_schemas, visited):
    if schema_name in visited:
        return
    visited.add(schema_name)

    if schema_name in all_schemas:
        schema = all_schemas[schema_name]
        refs = set()
        find_refs(schema, refs)
        for ref in refs:
            expand_schema_refs(ref, all_schemas, visited)

all_referenced = set(referenced_schemas)
for schema_name in list(referenced_schemas):
    expand_schema_refs(schema_name, schemas, all_referenced)

# Print all schemas
print(f"\nTotal schemas referenced: {len(all_referenced)}")
print("\nSchema names:")
for schema_name in sorted(all_referenced):
    print(f"  - {schema_name}")

print("\n\nDetailed schema definitions:")
for schema_name in sorted(all_referenced):
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
        print(f"Description: {description[:200]}..." if len(description) > 200 else f"Description: {description}")

    # Properties
    properties = schema.get('properties', {})
    if properties:
        print("\nProperties:")
        required = schema.get('required', [])
        for prop_name, prop_spec in properties.items():
            prop_type = prop_spec.get('type', 'unknown')
            prop_ref = prop_spec.get('$ref', '')
            prop_desc = prop_spec.get('description', '')
            is_required = prop_name in required

            if prop_ref:
                ref_name = prop_ref.split('/')[-1]
                print(f"  - {prop_name}: {ref_name} {'(required)' if is_required else ''}")
            else:
                print(f"  - {prop_name}: {prop_type} {'(required)' if is_required else ''}")

            if prop_desc:
                print(f"    {prop_desc[:150]}..." if len(prop_desc) > 150 else f"    {prop_desc}")

            # Handle arrays
            if prop_type == 'array':
                items = prop_spec.get('items', {})
                items_ref = items.get('$ref', '')
                if items_ref:
                    items_name = items_ref.split('/')[-1]
                    print(f"    Array of: {items_name}")
                else:
                    items_type = items.get('type', 'unknown')
                    print(f"    Array of: {items_type}")

    # Enum values
    enum_values = schema.get('enum', [])
    if enum_values:
        print(f"\nEnum values: {', '.join(enum_values)}")

print("\n\n" + "=" * 80)
print("END OF EXTRACTION")
print("=" * 80)
