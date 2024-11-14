import { useEffect, useState } from "react";
import { fetchTicketTypes } from "../util/api";
import { useSettings } from "./SettingsContext";
import { useBasket } from "./BasketContext";

export default function TicketOrderControl({
  selectedEventId,
  selectedEventName,
}) {
  const settings = useSettings(); // url and auth header info
  const [ticketTypes, setTicketTypes] = useState([]);
  const [selectedTicketTypeId, setSelectedTicketTypeId] = useState(0);
  const params = new URLSearchParams([["eventId", selectedEventId]]); // query params to find ticketTypes by eventId
  const [selectedTicketType, setSelectedTicketType] = useState(null);
  const { addToBasket } = useBasket();
  const [price, setPrice] = useState(0);
  const [amount, setAmount] = useState(1);

  useEffect(() => {
    if (selectedEventId == 0) return;
    setSelectedTicketTypeId(0); // clear tickettype selection when selectedEventId changes
    const getTicketTypes = async () => {
      try {
        console.log("params: ", params);
        const fetchedTicketTypes = await fetchTicketTypes(settings, params); // pass settings and query params to api
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
      setPrice(ticketType.retailPrice);
    } else {
      setSelectedTicketType(null); // Clear if no valid selection
      setPrice(0);
    }
  }, [selectedTicketTypeId, ticketTypes]);

  const handleAddToBasket = (
    ticketType,
    quantity,
    price,
    selectedEventName
  ) => {
    addToBasket(ticketType, quantity, price, selectedEventName);
  };

  const handlePriceChange = (e) => {
    setPrice(Number(e.target.value));
  };

  const handleAmountChange = (e) => {
    setAmount(Number(e.target.value));
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
      {selectedTicketType ? (
        <div>
          <h2>Selected Ticket Type:</h2>
          <p>ID: {selectedTicketType.id}</p>
          <p>Name: {selectedTicketType.name}</p>
          <p>Retail price: {selectedTicketType.retailPrice}</p>
          <p>Available: {selectedTicketType.totalAvailable}</p>
          <label>
            Price:
            <input
              type="number"
              value={price}
              onChange={handlePriceChange}
              step={0.01}
            />
          </label>
          <label>
            Amount:
            <input type="number" value={amount} onChange={handleAmountChange} />
          </label>
          <button
            onClick={() =>
              handleAddToBasket(
                selectedTicketType,
                amount,
                price,
                selectedEventName
              )
            }
          >
            Add to Basket
          </button>
        </div>
      ) : (
        selectedTicketTypeId !== 0 && <p>Loading ticket type details...</p>
      )}
    </div>
  );
}
