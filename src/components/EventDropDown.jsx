import {
  FormControl,
  InputLabel,
  Select,
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

import { formatDateTime } from "../util/helperfunctions";

export default function EventDropDown({ selectedEventId, setSelectedEventId }) {
  const settings = useSettings(); // url and auth header information
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getEvents = async () => {
      try {
        setLoading(true);
        const fetchedEvents = await fetchEvents(settings);
        setEvents(fetchedEvents);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
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
    }
  }, [selectedEvent]);

  return loading ? (
    <div>Loading...</div>
  ) : (
    <Stack>
      <FormControl fullWidth>
        <InputLabel id="event-label">Event</InputLabel>
        <Select
          id="eventSelect"
          value={selectedEventId}
          labelId="event-label"
          onChange={handleChange}
          label="Event"
        >
          <MenuItem value={0}>Select an event</MenuItem>
          {events?.map((event) => (
            <MenuItem key={event.id} value={event.id}>
              {event.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Table size="small">
        <TableBody>
          <TableRow>
            <TableCell>Event name</TableCell>
            <TableCell>{selectedEvent?.name || ""}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Description</TableCell>
            <TableCell>{selectedEvent?.description || ""}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Total tickets</TableCell>
            <TableCell>{selectedEvent?.totalTickets || ""}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Event begins</TableCell>
            <TableCell>{formatDateTime(selectedEvent?.beginsAt)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Event ends</TableCell>
            <TableCell>{formatDateTime(selectedEvent?.endsAt)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Ticket sale begins </TableCell>
            <TableCell>
              {formatDateTime(selectedEvent?.ticketSaleBegins)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Stack>
  );
}
