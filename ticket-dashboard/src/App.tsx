import { useEffect, useState } from "react";
import { fetchTickets, updateTicketStatus } from "./api/ticketsApi.js";
import TicketRow from "./components/TicketList.jsx";
import "./App.css";

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
    <main className="app">
      <h1>Support Tickets</h1>
      <h1>Support Tickets</h1>
      <p className="subtitle">Review tickets and update their status.</p>

      <div className="filter">
        <label htmlFor="filter">Filter by status</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {FILTERS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      <p className="visually-hidden" role="status">
        {notice}
      </p>
      {notice && <p className="success">{notice}</p>}

      {loading && (
        <p role="status" className="state-msg">
          <span className="spinner" aria-hidden="true" /> Loading tickets...
        </p>
      )}
      {loadError && <p role="alert">{loadError}</p>}

      {!loading && !loadError && visible.length === 0 && (
        <p className="empty">No tickets with status "{filter}".</p>
      )}

      {!loading && visible.length > 0 && (
        <ul className="ticket-list">
          {visible.map((ticket) => (
            <TicketRow
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
