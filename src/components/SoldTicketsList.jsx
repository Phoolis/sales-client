import { useEffect, useState } from "react";
import { useSettings } from "./SettingsContext";
import { fetchTickets } from "../util/api";

export default function SoldTicketsList({ soldTicketsData }) {
  const [tickets, setTickets] = useState([]);
  const settings = useSettings();

  useEffect(() => {
    if (!soldTicketsData) return;
    const getTickets = async () => {
      try {
        const ticketIds = soldTicketsData.ticketIds.toString();
        console.log("ticketIds: ", ticketIds);
        const fetchedTickets = await fetchTickets(settings, ticketIds);
        setTickets(fetchedTickets);
      } catch (error) {
        console.error(error);
      }
    };
    getTickets();
  }, [soldTicketsData]);

  return (
    <div>
      {soldTicketsData && (
        <div>
          <p>Sale event {soldTicketsData.id} successful!</p>
          <p>Sale posted at: {soldTicketsData.paidAt}</p>
          <p>Sold by user: {soldTicketsData.userId}</p>
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Ticket type</th>
                <th>Venue</th>
                <th>Price</th>
                <th>Barcode</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket, index) => (
                <tr key={index}>
                  <td>{ticket.event.name}</td>
                  <td>{ticket.ticketType.name}</td>
                  <td>{ticket.venue.name}</td>
                  <td>{ticket.price.toFixed(2)}</td>
                  <td>{ticket.barcode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
