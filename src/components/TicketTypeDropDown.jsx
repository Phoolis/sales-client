// STUB drop-down menu for ticket-types of the selected event
// STUB drop-down menu for events
import { useEffect, useState } from "react";
import { fetchTicketTypes } from "../util/api";
import { useSettings } from "../util/SettingsContext";

export default function TicketTypeDropDown({ selectedEventId }) {
  const settings = useSettings();
  const [ticketTypes, setTicketTypes] = useState([]);
  const [selectedTicketTypeId, setSelectedTicketTypeId] = useState(0);
  const params = new URLSearchParams([["eventId", selectedEventId]]);

  useEffect(() => {
    if (selectedEventId == 0) return;
    const getTicketTypes = async () => {
      try {
        console.log("params: ", params);
        const fetchedTicketTypes = await fetchTicketTypes(settings, params);
        setTicketTypes(fetchedTicketTypes);
      } catch (error) {
        console.error(error);
      }
    };
    getTicketTypes();
  }, [selectedEventId]);

  const handleChange = (e) => {
    setSelectedTicketTypeId(e.target.value);
  };

  return (
    <div>
      <select
        id="ticketTypeSelect"
        value={selectedTicketTypeId}
        onChange={handleChange}
      >
        <option value="0">Select ticket type</option>
        {ticketTypes.map((ticketType) => (
          <option key={ticketType.id} value={ticketType.id}>
            {ticketType.name}
          </option>
        ))}
      </select>
      <p>Selected ticketTypeId: {selectedTicketTypeId}</p>
    </div>
  );
}
