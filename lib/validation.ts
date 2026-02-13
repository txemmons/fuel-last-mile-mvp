import { EventType, Unit } from "@prisma/client";

export type EventInput = {
  eventType: EventType;
  eventTimestamp: string;
  siteId: string;
  fuelType: string;
  quantity: string;
  unit: Unit;
  onHandAfter?: string;
  notes?: string;
  sourceRef?: string;
  supplier?: string;
  deliveryRef?: string;
  batchOrLot?: string;
  consumerType?: string;
  missionOrTaskRef?: string;
  expectedQuantity?: string;
  actualQuantity?: string;
  shortfallReason?: string;
  incidentFlag?: boolean;
};

export function validateEventInput(input: EventInput): string[] {
  const errors: string[] = [];

  if (!input.eventTimestamp) errors.push("Event timestamp is required.");
  if (!input.siteId.trim()) errors.push("Site ID is required.");
  if (!input.fuelType.trim()) errors.push("Fuel type is required.");

  const quantity = Number(input.quantity);
  if (!Number.isFinite(quantity)) {
    errors.push("Quantity must be a number.");
  } else if (quantity <= 0) {
    errors.push("Quantity must be greater than zero.");
  }

  if (input.onHandAfter) {
    const onHandAfter = Number(input.onHandAfter);
    if (!Number.isFinite(onHandAfter) || onHandAfter < 0) {
      errors.push("On hand after must be zero or greater.");
    }
  }

  if (input.eventType === "SHORTFALL") {
    const expected = Number(input.expectedQuantity);
    const actual = Number(input.actualQuantity);

    if (!Number.isFinite(expected) || expected < 0) {
      errors.push("Expected quantity is required for shortfalls and must be 0 or greater.");
    }

    if (!Number.isFinite(actual) || actual < 0) {
      errors.push("Actual quantity is required for shortfalls and must be 0 or greater.");
    }

    if (Number.isFinite(expected) && Number.isFinite(actual) && actual > expected) {
      errors.push("Actual quantity cannot exceed expected quantity for a shortfall event.");
    }
  }

  return errors;
}
