# Support Ticket Dashboard

React + Vite + Tailwind CSS v4, no extra UI libraries.

## Run

npm install
npm run dev

Open the URL shown in the terminal (usually http://localhost:5173).

## Reproduce the failed save

The mock API (`src/api/ticketsApi.js`) always fails the **first** save
attempt after the page loads.

1. Load (or refresh) the page.
2. Change any ticket's status, e.g. #101 Open -> Resolved.
3. An error appears with a Retry button, and the ticket still shows its
   last saved status (Open).

## Verify the retry

1. Click Retry.
2. The ticket now shows the new status (Resolved) and a success message.
3. Switch the filter: the ticket appears under "Resolved" and is gone from
   "Open". If a filter has no tickets, a "No tickets with status ..." message shows.

Refreshing the page resets the counter, so the first save fails again.

## Notes

- Dropdown value always comes from the last saved status, so a failed
  save never shows an unsaved value.
- If you change a ticket's status while a filter is active, it may
  leave that filtered list. This is expected.
- Keyboard: Tab to controls, use arrow keys / Enter / Space on selects
  and Enter / Space on the Retry button.

## AI usage

(Likhna: tumne AI kis kaam ke liye use kiya, e.g. code structure ya README
draft, aur tumne khud kya test kiya, e.g. manual test of fail/retry/filter
flow aur keyboard navigation.)

## What I would do next

- Unit tests for the fail-then-retry flow
- Per-ticket "first save fails" option
- Move focus to a sensible place after a ticket leaves a filtered list
- Better styling