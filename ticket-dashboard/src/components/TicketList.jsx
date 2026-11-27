
const STATUSES = ["Open", "In progress", "Resolved"];

const TicketList = ({ ticket, state, onChangeStatus, onRetry }) => {
    const { saving = false, error = null, pendingStatus = null } = state || {};
    const selectId = `status-${ticket.id}`;
    const badgeClass = `badge badge-${ticket.status.toLowerCase().replace(" ", "-")}`;
    return (
        <li className="ticket">
            <div className="ticket-main">
                <span className="ticket-id">#{ticket.id}</span>
                <span className="ticket-title">{ticket.title}</span>
                <span className={badgeClass}>{ticket.status}</span>
            </div>

            <div className="ticket-controls">
                <label htmlFor={selectId}>
                    Status <span className="visually-hidden">for ticket {ticket.id}</span>
                </label>
                <select
                    id={selectId}
                    value={ticket.status}
                    disabled={saving}
                    onChange={(e) => onChangeStatus(ticket.id, e.target.value)}
                >
                    {STATUSES.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
                {saving && <span role="status">Saving...</span>}
            </div>

            {error && (
                <div className="error" role="alert">
                    <p>
                        Could not save "{pendingStatus}". Showing last saved status:{" "}
                        <strong>{ticket.status}</strong>. ({error})
                    </p>
                    <button type="button" onClick={() => onRetry(ticket.id, pendingStatus)}>
                        Retry
                    </button>
                </div>
            )}
        </li>
    )
}

export default TicketList