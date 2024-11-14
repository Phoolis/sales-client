import { useEffect, useState } from "react";
import { fetchEvents } from "../util/api";
import { useSettings } from "./SettingsContext";

export default function EventDropDown({ selectedEventId, setSelectedEventId }) {
  const settings = useSettings(); // url and auth header information
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const getEvents = async () => {
      try {
        const fetchedEvents = await fetchEvents(settings);
        setEvents(fetchedEvents);
      } catch (error) {
        console.error(error);
      }
    };
    getEvents();
  }, []);

  useEffect(() => {
    // eventId passed from TicketSales
    if (selectedEventId !== 0) {
      const event = events.find((event) => event.id === selectedEventId);
      setSelectedEvent(event || null);
    } else {
      setSelectedEvent(null);
    }
  }, [selectedEventId, events]);

  const handleChange = (e) => {
    const eventId = Number(e.target.value); // select returns a string, have to parse as number
    setSelectedEventId(eventId);
  };

  // also pass the event name to TicketSales
  useEffect(() => {
    if (selectedEvent) {
      setSelectedEventId(selectedEventId, selectedEvent.name);
      console.log(selectedEvent.name);
    }
  }, [selectedEvent]);

  return (
    <div>
      <select id="eventSelect" value={selectedEventId} onChange={handleChange}>
        <option value="0">Select an event</option>
        {events.map((event) => (
          <option key={event.id} value={event.id}>
            {event.name}
          </option>
        ))}
      </select>
      <p>Selected eventId: {selectedEventId}</p>
      {selectedEvent && (
        <div>
          <h2>Selected Event:</h2>

          {
            // Loop over event key value pairs (too lazy to write them all out by hand)
            Object.entries(selectedEvent).map(([key, value]) => (
              <p key={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
              </p>
            ))
          }
        </div>
      )}
    </div>
  );
}
