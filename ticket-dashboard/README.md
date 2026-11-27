# Support Ticket Dashboard

A small support ticket dashboard built with React (Vite) and Tailwind CSS v4.
Tickets are loaded from a mock async API that lives in the same project.

## Run the app

    npm install
    npm run dev

Open the URL shown in the terminal (usually http://localhost:5173).
Live demo: [<your-vercel-link>](https://ticket-dashboard-chi-ten.vercel.app/)

## Reproduce the failed save

The mock API (`src/api/ticketsApi.js`) always fails the **first** save
attempt after the page loads. Later saves succeed.

1. Load or refresh the page.
2. Change any ticket's status, e.g. #101 Open -> Resolved.
3. An error message with a Retry button appears.
4. The ticket still shows its last saved status (Open) in both the dropdown
   and the badge.

## Verify the retry

1. Click **Retry**.
2. The ticket now shows the new status (Resolved) and a success message.
3. Set the filter to "Open": #101 is gone and a "No tickets with status
   'Open'" message appears. Set it to "Resolved": #101 and #103 are listed.

Refreshing the page resets the mock API, so the first save fails again.

## Features

- Mock async API with a loading state
- Filter by status, with an empty-state message
- Change status from the list
- Failed save: error shown, last saved status kept, retry available
- Keyboard usable: Tab to controls, arrow keys on selects, Enter/Space on
  the Retry button. Visible focus rings, labelled controls, `role="status"`
  and `role="alert"` for announcements

## Design decisions

- The status dropdown and badge always read from the last *saved* status.
  The ticket list is only updated after the API call succeeds, so a failed
  save can never show an unsaved value.
- The filtered list is derived from `tickets` + `filter` (not stored in
  state), so after a successful retry it updates automatically.
- Saving happens only in event handlers, not in effects, so React
  StrictMode cannot trigger an extra save.
- Per-ticket save state (`saving`, `error`, `pendingStatus`) lets Retry
  re-send the exact status the user tried to set.

## AI usage
I used an AI assistant (Claude) for: Error handling and and refining the UI styling to ensure a smoother and more consistent user experience.
