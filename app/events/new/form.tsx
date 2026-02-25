"use client";

import { useActionState, useState } from "react";
import { createFuelEvent } from "./actions";

const initialState = { errors: [] as string[] };

export function EventForm() {
  const [state, formAction, pending] = useActionState(createFuelEvent, initialState);
  const [eventType, setEventType] = useState("RECEIPT");

  return (
    <form action={formAction}>
      <p>Submitting as mock user: Demo Recorder</p>

      {state.errors.length > 0 && (
        <ul className="error-list">
          {state.errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}

      <label>
        Event Type
        <select name="eventType" value={eventType} onChange={(e) => setEventType(e.target.value)}>
          <option value="RECEIPT">Receipt</option>
          <option value="CONSUMPTION">Consumption</option>
          <option value="SHORTFALL">Shortfall</option>
        </select>
      </label>

      <label>
        Event Timestamp
        <input name="eventTimestamp" type="datetime-local" required />
      </label>

      <label>
        Site ID
        <input name="siteId" required />
      </label>

      <label>
        Fuel Type
        <input name="fuelType" placeholder="Diesel" required />
      </label>

      <label>
        Quantity
        <input name="quantity" type="number" min="0" step="0.01" required />
      </label>

      <label>
        Unit
        <select name="unit" defaultValue="LITERS">
          <option value="LITERS">Liters</option>
          <option value="GALLONS">Gallons</option>
        </select>
      </label>

      <label>
        On Hand After (optional)
        <input name="onHandAfter" type="number" min="0" step="0.01" />
      </label>

      {eventType === "RECEIPT" && (
        <>
          <label>
            Supplier
            <input name="supplier" />
          </label>
          <label>
            Delivery Ref
            <input name="deliveryRef" />
          </label>
          <label>
            Batch/Lot
            <input name="batchOrLot" />
          </label>
        </>
      )}

      {eventType === "CONSUMPTION" && (
        <>
          <label>
            Consumer Type
            <input name="consumerType" placeholder="Vehicle / Generator" />
          </label>
          <label>
            Mission/Task Ref
            <input name="missionOrTaskRef" />
          </label>
        </>
      )}

      {eventType === "SHORTFALL" && (
        <>
          <label>
            Expected Quantity
            <input name="expectedQuantity" type="number" min="0" step="0.01" required />
          </label>
          <label>
            Actual Quantity
            <input name="actualQuantity" type="number" min="0" step="0.01" required />
          </label>
          <label>
            Shortfall Reason
            <input name="shortfallReason" />
          </label>
          <label>
            Incident Flag
            <input name="incidentFlag" type="checkbox" />
          </label>
        </>
      )}

      <label>
        Source Ref (optional)
        <input name="sourceRef" />
      </label>

      <label>
        Notes (optional)
        <textarea name="notes" rows={3} />
      </label>

      <button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save Event"}
      </button>
    </form>
  );
}
