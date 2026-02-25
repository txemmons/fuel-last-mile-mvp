export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";

function escapeCsv(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

export async function GET() {
  const events = await prisma.fuelEvent.findMany({
    orderBy: { eventTimestamp: "asc" },
  });

  const header = [
    "id",
    "eventType",
    "eventTimestamp",
    "siteId",
    "fuelType",
    "quantity",
    "unit",
    "onHandAfter",
    "reportedBy",
    "notes",
    "sourceRef",
  ];

  const rows = events.map((event) => [
    event.id,
    event.eventType,
    event.eventTimestamp.toISOString(),
    event.siteId,
    event.fuelType,
    event.quantity.toString(),
    event.unit,
    event.onHandAfter?.toString() ?? "",
    event.reportedBy,
    event.notes ?? "",
    event.sourceRef ?? "",
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map((value) => escapeCsv(String(value))).join(","))
    .join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=fuel-events-summary.csv",
    },
  });
}
