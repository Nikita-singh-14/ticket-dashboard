const STATUSES = ["Open", "In progress", "Resolved"];

const BADGE_STYLES = {
  Open: "bg-amber-100 text-amber-900 border-amber-300",
  "In progress": "bg-blue-100 text-blue-900 border-blue-300",
  Resolved: "bg-green-100 text-green-900 border-green-300",
};

function TicketList({ ticket, state, onChangeStatus, onRetry }) {
  const { saving = false, error = null, pendingStatus = null } = state || {};
  const selectId = `status-${ticket.id}`;

  return (
    <li className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <span className="font-semibold tabular-nums text-slate-500">
          #{ticket.id}
        </span>
        <span className="min-w-50 flex-1 font-semibold text-slate-900">
          {ticket.title}
        </span>
        <span
          className={`rounded-full border px-3 py-0.5 text-xs font-bold ${BADGE_STYLES[ticket.status]}`}
        >
          {ticket.status}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor={selectId} className="text-sm text-slate-500">
          Status <span className="sr-only">for ticket {ticket.id}</span>
        </label>
        <select
          id={selectId}
          value={ticket.status}
          disabled={saving}
          onChange={(e) => onChangeStatus(ticket.id, e.target.value)}
          className="cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:bg-slate-100"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {saving && (
          <span role="status" className="text-sm text-slate-500">
            Saving...
          </span>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-l-4 border-red-600 bg-red-50 px-4 py-3 text-red-900"
        >
          <p>
            Could not save "{pendingStatus}". Showing last saved status:{" "}
            <strong>{ticket.status}</strong>. ({error})
          </p>
          <button
            type="button"
            onClick={() => onRetry(ticket.id, pendingStatus)}
            className="cursor-pointer rounded-lg bg-blue-700 px-4 py-1.5 font-semibold text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Retry
          </button>
        </div>
      )}
    </li>
  );
}

export default TicketList;