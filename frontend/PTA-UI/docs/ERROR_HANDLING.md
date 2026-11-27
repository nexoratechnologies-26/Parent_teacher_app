# Error handling and server availability

## What users see

- On app startup, the client probes the API base. Network failures, requests that time out after 15 seconds, and HTTP 5xx responses raise the persistent **Server unavailable** notice at the top of the app.
- The notice stays visible across route changes. **Retry** probes the last failing API URL or the Supabase Auth health endpoint and clears the notice only after the service responds.
- Normal API requests time out after 15 seconds; retry probes time out after 8 seconds.
- HTTP 4xx responses mean the server responded. They do not show the outage notice; authentication and form validation errors remain on their respective screens.
- Read requests currently keep their existing mock-data fallback so a screen can still render during an outage. The notice makes that degraded state visible.
- Failed writes must not be presented as successful. Homework and notice creation now report an error and leave success confirmation for successful writes only.
- Unexpected screen rendering errors are caught by the Expo Router screen error boundary. The fallback shows a safe message and a retry action without exposing internal error details.

## Implementation map

| File | Responsibility |
| --- | --- |
| `services/serverStatus.ts` | Shared server status, subscriptions, connectivity classification, fetch wrapper, and retry probe |
| `components/ui/ServerStatusNotice.tsx` | App-wide outage notice and retry control |
| `components/ui/RouteErrorFallback.tsx` | Safe UI for uncaught route rendering errors |
| `app/_layout.tsx` | Mounts the global notice and configures the screen error boundary |
| `services/parentApi.ts` | Routes API requests through the status-aware fetch wrapper |
| `services/authService.ts` | Reports Supabase Auth transport/server failures while preserving credential errors |

## Failure handling rules

1. Validate user input before starting a request. Keep validation messages beside the relevant form field.
2. Treat fetch rejection, timeout/network errors, and HTTP 5xx as service availability failures. Use `fetchWithServerStatus` for API calls so the app-wide notice stays in sync.
3. Treat HTTP 4xx as an application response. Show a useful message for invalid credentials, missing permissions, or invalid data; do not label these as outages.
4. For asynchronous mutations, show success only after the server confirms success. Surface failures to the user and keep the form available for correction or retry.
5. Read screens can use cached/mock data while offline, but keep the global outage notice visible so users can distinguish fallback content from live data.
6. Catch unexpected render errors with the Expo Router screen boundary. Do not print stack traces, credentials, tokens, or personal data in user-facing UI.

## When changing server integrations

- Add new REST calls through `fetchWithServerStatus` in `services/serverStatus.ts`.
- For Supabase or another SDK, call `reportConnectivityError(error, probe)` for network or 5xx failures and `reportServerAvailable()` after a confirmed successful operation. Make the probe a harmless health/read request.
- Preserve response status codes. Check `response.ok` before parsing a successful mutation response.
- If the backend health URL changes, update the probe associated with the failing service and this document.
- Set `EXPO_PUBLIC_API_URL` to the reachable API base (including `/api/v1` when required) for native builds. Browsers can use the current site origin; native apps cannot resolve the relative `/api/v1` fallback.
- Keep `EXPO_PUBLIC_USE_MOCK=true` behavior explicit. Demo/mock success is not a successful server write.

## Current limitations

- The API client still has mock fallback data for read operations. That data is in-memory/static and does not persist writes across sessions.
- Retry probes confirm that the endpoint responds; they do not automatically replay a failed request. Users should retry the original action after the notice clears.
- The teacher attendance, student roster, and marks screens currently use local mock data and are not connected to write APIs.

## Maintenance checklist

- When adding an API call, use the shared status-aware fetch path.
- When adding a mutation, handle validation, loading, success, and failure states separately.
- When changing route layouts, preserve the root status notice and inherited screen error boundary.
- Keep this file aligned with actual fallback and retry behavior when those policies change.
