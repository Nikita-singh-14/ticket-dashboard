let tickets = [
  { id: 101, title: "Invoice PDF fails to download", status: "Open" },
  { id: 102, title: "Update billing contact", status: "In progress" },
  { id: 103, title: "Duplicate confirmation email", status: "Resolved" },
];

let saveAttempts = 0;

export function fetchTickets() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(tickets.map((t) => ({ ...t }))), 800);
  });
}

export function updateTicketStatus(id, status) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      saveAttempts += 1;
      if (saveAttempts === 1) {
        reject(new Error("Save failed. Please retry."));
        return;
      }
      tickets = tickets.map((t) => (t.id === id ? { ...t, status } : t));
      resolve({ id, status });
    }, 600);
  });
}