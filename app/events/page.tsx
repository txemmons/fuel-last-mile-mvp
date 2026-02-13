export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";

export default async function EventsPage() {
  const events = await prisma.fuelEvent.findMany({
    orderBy: {
      eventTimestamp: "desc",
    },
  });

  return (
    <section>
      <h2>Fuel Event Timeline</h2>
      {events.length === 0 ? (
        <p>No events yet. Add one at /events/new.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>When</th>
              <th>Type</th>
              <th>Site</th>
              <th>Fuel</th>
              <th>Quantity</th>
              <th>On Hand After</th>
              <th>Reported By</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>{event.eventTimestamp.toISOString()}</td>
                <td>{event.eventType}</td>
                <td>{event.siteId}</td>
                <td>{event.fuelType}</td>
                <td>
                  {event.quantity.toString()} {event.unit}
                </td>
                <td>{event.onHandAfter?.toString() ?? "-"}</td>
                <td>{event.reportedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
