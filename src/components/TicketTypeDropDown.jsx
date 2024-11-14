import { useEffect, useState } from "react";
import { fetchTicketTypes } from "../util/api";
import { useSettings } from "../util/SettingsContext";

export default function TicketTypeDropDown({ selectedEventId }) {
  const settings = useSettings();
  const [ticketTypes, setTicketTypes] = useState([]);
  const [selectedTicketTypeId, setSelectedTicketTypeId] = useState(0);
  const params = new URLSearchParams([["eventId", selectedEventId]]);
  const [selectedTicketType, setSelectedTicketType] = useState(null);

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
    setSelectedTicketTypeId(Number(e.target.value)); // select returns a string, not a number
  };

  useEffect(() => {
    if (selectedTicketTypeId !== 0) {
      const ticketType = ticketTypes.find(
        (ticketType) => ticketType.id === selectedTicketTypeId
      );
      setSelectedTicketType(ticketType || null);
    } else {
      setSelectedTicketType(null); // Clear if no valid selection
    }
  }, [selectedTicketTypeId, ticketTypes]);

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
      {selectedTicketType ? (
        <div>
          <h2>Selected Ticket Type:</h2>
          <p>ID: {selectedTicketType.id}</p>
          <p>Name: {selectedTicketType.name}</p>
          <p>Price: {selectedTicketType.retailPrice}</p>
          <p>Available: {selectedTicketType.totalAvailable}</p>
        </div>
      ) : (
        selectedTicketTypeId !== 0 && <p>Loading ticket type details...</p>
      )}
    </div>
  );
}
