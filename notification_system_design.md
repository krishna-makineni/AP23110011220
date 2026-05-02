# Campus Notification System Design

## Architecture Overview
The Campus Notification System is built as a microservice frontend using **Next.js 15** and **Material UI (MUI) 6**. It provides a real-time interface for students to stay updated with campus activities, results, and placement news.

## Priority Inbox Logic
The "Priority Inbox" is the core feature of this service. It ensures that the most critical information is presented first to the user.

### Sorting Algorithm
Notifications are sorted based on two criteria:

1.  **Weightage (Primary)**:
    -   **Placement**: Weight 3 (Highest)
    -   **Result**: Weight 2 (Medium)
    -   **Event**: Weight 1 (Lowest)
    
2.  **Recency (Secondary)**:
    -   If two notifications have the same weight, the one with the most recent timestamp is prioritized.

### Constraints
-   **Display Limit**: Only the **top 10** notifications are displayed in the Priority Inbox.
-   **Dynamic Fetching**: Data is fetched directly from the evaluation service API at runtime. No local database is used for storing notification content in this stage.

## Technical Stack
-   **Frontend**: Next.js (App Router), React 18/19.
-   **Styling**: Material UI with a custom Cyberpunk-themed dark palette.
-   **Logging**: A custom Winston-based logger (`logger.ts`) is used to track API calls and application errors.

## API Integration & Security

### CORS Bypass (Proxy)
To resolve CORS issues where the external server sends multiple `Access-Control-Allow-Origin` values, the application uses a **Next.js API Route (`/api/notifications`)** as a proxy. This ensures that:
- Requests to the external API are made server-side.
- Browser CORS policies are bypassed.
- Sensitive headers can be managed securely.

### Authentication
The external API is a **protected route**. 
- Users must provide a **Bearer Token** obtained via the registration and auth endpoints.
- The application includes an **AuthManager** component that allows users to securely store their `access_token` in `localStorage`.
- All proxied requests include the `Authorization: Bearer <token>` header.

## API Integration
The system integrates with the following local proxy:
`/api/notifications` -> `http://20.207.122.201/evaluation-service/notifications`
