# Communication API - TODO

This file outlines the tasks for completing the implementation of the Communication API.

## Missing Endpoints

The following endpoints are defined in the OpenAPI specification but are not yet implemented in the server:

### Feedback
- `GET /awaiting_feedback` - Get items awaiting feedback
- `GET /feedback_rating_summary` - Get feedback rating summary
- `POST /respond_to_feedback` - Respond to feedback

### Message
- `POST /bulk_update_conversation` - Bulk update conversation
- `GET /conversation/{conversation_id}` - Get conversation
- `GET /conversation` - Get conversations
- `POST /send_message` - Send a message
- `POST /update_conversation` - Update a conversation

### Negotiation
- `GET /find_eligible_items` - Find eligible items for a seller-initiated offer

### Notification
- `GET /subscription` - Get all subscriptions
- `POST /subscription` - Create a subscription
- `GET /subscription/{subscription_id}` - Get a subscription
- `PUT /subscription/{subscription_id}` - Update a subscription
- `DELETE /subscription/{subscription_id}` - Delete a subscription
- `POST /subscription/{subscription_id}/disable` - Disable a subscription
- `POST /subscription/{subscription_id}/enable` - Enable a subscription
- `POST /subscription/{subscription_id}/test` - Test a subscription
- `GET /topic/{topic_id}` - Get a topic
- `GET /topic` - Get all topics
- `POST /subscription/{subscription_id}/filter` - Create a subscription filter
- `GET /subscription/{subscription_id}/filter/{filter_id}` - Get a subscription filter
- `DELETE /subscription/{subscription_id}/filter/{filter_id}` - Delete a subscription filter

## Improvements

- **Input Validation:** Add input validation to all endpoints to ensure that the data sent by the AI client is valid.
- **Error Handling:** Improve error handling to provide more detailed and structured error messages to the AI client.
- **Testing:** Add unit tests for all endpoints.
