import { useState } from "react";
import EventDropDown from "./EventDropDown";
import TicketTypeDropDown from "./TicketTypeDropDown";
import Basket from "./Basket";
import SoldTicketsList from "./SoldTicketsList";

export default function TicketSales() {
  const [selectedEventId, setSelectedEventId] = useState(0);
  const [selectedEventName, setSelectedEventName] = useState("");
  const [soldTicketsData, setSoldTicketsData] = useState(null);

  const handleEventSelect = (eventId, eventName) => {
    setSelectedEventId(eventId);
    setSelectedEventName(eventName); // Set the event name when an event is selected
  };

  const handleSetSoldTicketsData = (data) => {
    setSoldTicketsData(data);
  };

  return (
    <div>
      <EventDropDown
        selectedEventId={selectedEventId}
        setSelectedEventId={handleEventSelect}
      />
      <TicketTypeDropDown
        selectedEventId={selectedEventId}
        selectedEventName={selectedEventName}
      />
      <Basket setSoldTicketsData={handleSetSoldTicketsData} />
      <SoldTicketsList soldTicketsData={soldTicketsData} />
    </div>
  );
}
