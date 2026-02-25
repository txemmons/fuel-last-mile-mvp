export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";

type FuelSummaryRow = {
  fuelType: string;
  receipts: number;
  consumption: number;
  shortfalls: number;
  onHandEstimate: number;
};

export default async function SummaryPage() {
  const events = await prisma.fuelEvent.findMany({
    orderBy: {
      eventTimestamp: "asc",
    },
  });

  const totals = {
    RECEIPT: 0,
    CONSUMPTION: 0,
    SHORTFALL: 0,
  };

  const perFuelType = new Map<string, FuelSummaryRow>();

  for (const event of events) {
    const quantity = Number(event.quantity);
    totals[event.eventType] += quantity;

    const current = perFuelType.get(event.fuelType) ?? {
      fuelType: event.fuelType,
      receipts: 0,
      consumption: 0,
      shortfalls: 0,
      onHandEstimate: 0,
    };

    if (event.eventType === "RECEIPT") {
      current.receipts += quantity;
    } else if (event.eventType === "CONSUMPTION") {
      current.consumption += quantity;
    } else if (event.eventType === "SHORTFALL") {
      current.shortfalls += quantity;
    }

    current.onHandEstimate = current.receipts - current.consumption - current.shortfalls;
    perFuelType.set(event.fuelType, current);
  }

  const perFuelTypeRows = [...perFuelType.values()].sort((a, b) => a.fuelType.localeCompare(b.fuelType));

  const latestOnHand = [...events].reverse().find((event) => event.onHandAfter !== null)?.onHandAfter;

  return (
    <section>
      <h2>Summary</h2>
      <ul>
        <li>Total Receipts: {totals.RECEIPT.toFixed(2)}</li>
        <li>Total Consumption: {totals.CONSUMPTION.toFixed(2)}</li>
        <li>Total Shortfall: {totals.SHORTFALL.toFixed(2)}</li>
        <li>Latest On-Hand (if provided): {latestOnHand?.toString() ?? "Not set"}</li>
      </ul>

      <h3>On-hand Estimate by Fuel Type</h3>
      {events.length === 0 ? (
        <p>No events yet. Add one at /events/new.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Fuel Type</th>
              <th>Receipts</th>
              <th>Consumption</th>
              <th>Shortfalls</th>
              <th>On-hand estimate</th>
            </tr>
          </thead>
          <tbody>
            {perFuelTypeRows.map((row) => (
              <tr key={row.fuelType}>
                <td>{row.fuelType}</td>
                <td>{row.receipts.toFixed(2)}</td>
                <td>{row.consumption.toFixed(2)}</td>
                <td>{row.shortfalls.toFixed(2)}</td>
                <td>{row.onHandEstimate.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p>
        <Link href="/api/summary/export">Download CSV Export</Link>
      </p>

      {/* TODO(ai): Add AI-assisted summary and data-quality checks in a future milestone. */}
    </section>
  );
}
