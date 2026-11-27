import { useEffect, useState } from "react";
import { fetchTickets, updateTicketStatus } from "./api/ticketsApi.js";
import TicketList from "./components/TicketList.jsx";

const FILTERS = ["All", "Open", "In progress", "Resolved"];

function App() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [filter, setFilter] = useState("All");
  const [saveState, setSaveState] = useState({});
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchTickets()
      .then((data) => {
        if (!cancelled) setTickets(data);
      })
      .catch(() => {
        if (!cancelled) setLoadError("Could not load tickets.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function saveStatus(id, newStatus) {
    setNotice("");
    setSaveState((s) => ({
      ...s,
      [id]: { saving: true, error: null, pendingStatus: newStatus },
    }));
    try {
      await updateTicketStatus(id, newStatus);
      setTickets((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
      );
      setSaveState((s) => ({
        ...s,
        [id]: { saving: false, error: null, pendingStatus: null },
      }));
      setNotice(`Ticket ${id} updated to ${newStatus}.`);
    } catch (err) {
      setSaveState((s) => ({
        ...s,
        [id]: { saving: false, error: err.message, pendingStatus: newStatus },
      }));
    }
  }

  const visible =
    filter === "All" ? tickets : tickets.filter((t) => t.status === filter);

  return (
    <main className="mx-auto my-10 max-w-3xl px-4">
      <h1 className="text-3xl font-bold text-slate-900">Support Tickets</h1>
      <p className="mb-6 mt-1 text-slate-500">
        Review tickets and update their status.
      </p>

      <div className="mb-5 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <label htmlFor="filter" className="font-semibold">
          Filter by status
        </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          {FILTERS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      <p className="sr-only" role="status">
        {notice}
      </p>
      {notice && (
        <p className="mb-4 rounded-lg border border-green-300 bg-green-50 px-3 py-2 text-green-800">
          {notice}
        </p>
      )}

      {loading && (
        <p role="status" className="flex items-center gap-2 text-slate-500">
          <span
            aria-hidden="true"
            className="size-4 animate-spin rounded-full border-[3px] border-slate-200 border-t-blue-700 motion-reduce:animate-none"
          />
          Loading tickets...
        </p>
      )}
      {loadError && <p role="alert">{loadError}</p>}

      {!loading && !loadError && visible.length === 0 && (
        <p className="rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-8 text-center text-slate-500">
          No tickets with status "{filter}".
        </p>
      )}

      {!loading && visible.length > 0 && (
        <ul className="grid gap-3">
          {visible.map((ticket) => (
            <TicketList
              key={ticket.id}
              ticket={ticket}
              state={saveState[ticket.id]}
              onChangeStatus={saveStatus}
              onRetry={saveStatus}
            />
          ))}
        </ul>
      )}
    </main>
  );
}

export default App;