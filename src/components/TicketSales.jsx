import { useState } from "react";
import EventDropDown from "./EventDropDown";

export default function TicketSales() {
  const [selectedEventId, setSelectedEventId] = useState(0);

  return (
    <div>
      <EventDropDown
        selectedEventId={selectedEventId}
        setSelectedEventId={setSelectedEventId}
      />
      <p>Selected eventId: {selectedEventId}</p>
    </div>
  );
}
