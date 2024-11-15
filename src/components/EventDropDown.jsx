import {
  FormControl,
  InputLabel,
  Select,
  Box,
  MenuItem,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Stack,
} from "@mui/material";

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
    const eventId = e.target.value;
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
    <Stack>
        <FormControl fullWidth>
          <InputLabel>Event</InputLabel>
          <Select
            id="eventSelect"
            value={selectedEventId}
            onChange={handleChange}
            label="Event"
          >
            <MenuItem value={0}>Select an event</MenuItem>
            {events.map((event) => (
              <MenuItem key={event.id} value={event.id}>
                {event.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      {console.log("Selected eventId", selectedEventId)}
      {selectedEvent && (
          <Table size="small">
            <TableBody>
              {Object.entries(selectedEvent).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </TableCell>
                  <TableCell>{value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
      )}
    </Stack>
  );
}
