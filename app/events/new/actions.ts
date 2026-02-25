"use server";

import { EventType, Unit } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { mockUser } from "@/lib/mock-user";
import { validateEventInput } from "@/lib/validation";

export type CreateEventState = {
  errors: string[];
};

function asOptionalString(value: FormDataEntryValue | null): string | undefined {
  const trimmed = (value?.toString() ?? "").trim();
  return trimmed ? trimmed : undefined;
}

export async function createFuelEvent(
  _prevState: CreateEventState,
  formData: FormData,
): Promise<CreateEventState> {
  const eventType = formData.get("eventType") as EventType;
  const unit = formData.get("unit") as Unit;

  const input = {
    eventType,
    eventTimestamp: (formData.get("eventTimestamp")?.toString() ?? "").trim(),
    siteId: (formData.get("siteId")?.toString() ?? "").trim(),
    fuelType: (formData.get("fuelType")?.toString() ?? "").trim(),
    quantity: (formData.get("quantity")?.toString() ?? "").trim(),
    unit,
    onHandAfter: asOptionalString(formData.get("onHandAfter")),
    notes: asOptionalString(formData.get("notes")),
    sourceRef: asOptionalString(formData.get("sourceRef")),
    supplier: asOptionalString(formData.get("supplier")),
    deliveryRef: asOptionalString(formData.get("deliveryRef")),
    batchOrLot: asOptionalString(formData.get("batchOrLot")),
    consumerType: asOptionalString(formData.get("consumerType")),
    missionOrTaskRef: asOptionalString(formData.get("missionOrTaskRef")),
    expectedQuantity: asOptionalString(formData.get("expectedQuantity")),
    actualQuantity: asOptionalString(formData.get("actualQuantity")),
    shortfallReason: asOptionalString(formData.get("shortfallReason")),
    incidentFlag: formData.get("incidentFlag") === "on",
  };

  const errors = validateEventInput(input);
  if (errors.length > 0) {
    return { errors };
  }

  await prisma.fuelEvent.create({
    data: {
      eventType,
      eventTimestamp: new Date(input.eventTimestamp),
      siteId: input.siteId,
      fuelType: input.fuelType,
      quantity: input.quantity,
      unit,
      onHandAfter: input.onHandAfter,
      reportedBy: mockUser.displayName,
      notes: input.notes,
      sourceRef: input.sourceRef,
      supplier: input.supplier,
      deliveryRef: input.deliveryRef,
      batchOrLot: input.batchOrLot,
      consumerType: input.consumerType,
      missionOrTaskRef: input.missionOrTaskRef,
      expectedQuantity: input.expectedQuantity,
      actualQuantity: input.actualQuantity,
      shortfallReason: input.shortfallReason,
      incidentFlag: Boolean(input.incidentFlag),
    },
  });

  revalidatePath("/events");
  revalidatePath("/summary");
  redirect("/events");
}
