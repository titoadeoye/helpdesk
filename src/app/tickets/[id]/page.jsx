import { notFound } from "next/navigation";

// prioritizes if true the rendering of a dynamic params psge. if false, returns a 404
export const dynamicParams = true;

export async function generateStaticParams() {
  const tickets = await fetch("http://localhost:4000/tickets").then(
    (response) => response.json()
  );
  return tickets.map((ticket) => ({ id: ticket.id }));
}

async function getTicket(id) {
  // imitate delay
  await new Promise((resolve, reject) => {
    setTimeout(resolve, 3000);
  });
  
  const res = await fetch("http://localhost:4000/tickets/" + id, {
    next: {
      revalidate: 60
    }
  });

  if (!res.ok) {
    notFound();
  }

  return res.json();
}

export default async function TicketDetails({ params }) {
  const ticket = (await getTicket(`${params?.id}`)) ?? {};
  console.log(ticket);

  return (
    <main>
      <nav>
        <h2>Ticket Details</h2>
      </nav>
      <div className="card">
        <h3>{ticket.title}</h3>
        <small>Created by {ticket.user_email}</small>
        <p>{ticket.body}</p>
        <div className={`pill ${ticket.priority}`}>
          {ticket.priority} priority
        </div>
      </div>
    </main>
  );
}
