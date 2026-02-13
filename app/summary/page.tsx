export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";

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

  for (const event of events) {
    totals[event.eventType] += Number(event.quantity);
  }

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

      <p>
        <Link href="/api/summary/export">Download CSV Export</Link>
      </p>

      {/* TODO(ai): Add AI-assisted summary and data-quality checks in a future milestone. */}
    </section>
  );
}
