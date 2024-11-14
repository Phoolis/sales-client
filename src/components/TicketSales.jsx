import { useState } from "react";
import EventDropDown from "./EventDropDown";
import TicketTypeDropDown from "./TicketTypeDropDown";
import Basket from "./Basket";

export default function TicketSales() {
  const [selectedEventId, setSelectedEventId] = useState(0);
  const [selectedEventName, setSelectedEventName] = useState(""); // State to store event name

  const handleEventSelect = (eventId, eventName) => {
    setSelectedEventId(eventId);
    setSelectedEventName(eventName); // Set the event name when an event is selected
  };

  return (
    <div>
      <EventDropDown
        selectedEventId={selectedEventId}
        setSelectedEventId={handleEventSelect}
      />
      <TicketTypeDropDown selectedEventId={selectedEventId} />
      <Basket selectedEventName={selectedEventName} />
    </div>
  );
}
