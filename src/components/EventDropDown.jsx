import { useEffect, useState } from "react";
import { fetchEvents } from "../util/api";
import { useSettings } from "../util/SettingsContext";

export default function EventDropDown({ selectedEventId, setSelectedEventId }) {
  const settings = useSettings();
  console.log(settings);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const getEvents = async () => {
      try {
        console.log("Settings: ", JSON.stringify(settings));
        const fetchedEvents = await fetchEvents(settings);
        setEvents(fetchedEvents);
      } catch (error) {
        console.error(error);
      }
    };
    getEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId !== 0) {
      const event = events.find((event) => event.id === selectedEventId);
      setSelectedEvent(event || null);
    } else {
      setSelectedEvent(null);
    }
  }, [selectedEventId, events]);

  const handleChange = (e) => {
    setSelectedEventId(Number(e.target.value));
  };

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
          {Object.entries(selectedEvent).map(([key, value]) => (
            <p key={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
