// STUB drop-down menu for events
import { useEffect, useState } from "react";
import { fetchEvents } from "../util/api";
import { useSettings } from "../util/SettingsContext";

export default function EventDropDown({ selectedEventId, setSelectedEventId }) {
  const settings = useSettings();
  console.log(settings);
  const [events, setEvents] = useState([]);
  const params = new URLSearchParams([["eventId", selectedEventId]]);

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

  const handleChange = (e) => {
    setSelectedEventId(e.target.value);
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
    </div>
  );
}
