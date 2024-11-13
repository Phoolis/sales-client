import { useState } from "react";
import EventDropDown from "./EventDropDown";
import TicketTypeDropDown from "./TicketTypeDropDown";

export default function TicketSales() {
  const [selectedEventId, setSelectedEventId] = useState(0);

  return (
    <div>
      <EventDropDown
        selectedEventId={selectedEventId}
        setSelectedEventId={setSelectedEventId}
      />
      <TicketTypeDropDown selectedEventId={selectedEventId} />
    </div>
  );
}
