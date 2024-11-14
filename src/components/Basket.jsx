// STUB shopping basket for tickets
// tickettypes, amounts, and prices selected for the sale are displayed here
import { useBasket } from "./BasketContext";
import { postBasketItems } from "../util/api";
import { useSettings } from "./SettingsContext";
import { useState } from "react";

export default function Basket({ selectedEventName }) {
  const { basket, setBasket } = useBasket();
  const settings = useSettings();
  const [soldTicketsData, setSoldTicketsData] = useState(null);

  const handleConfirmSale = async () => {
    try {
      const response = await postBasketItems(settings, basket);
      console.log(response);
      if (response.status === 201) {
        console.log(response.data);
        setSoldTicketsData(response.data);
      }
    } catch (error) {
      console.error("Error posting basket: ", error);
    }
  };

  const handleClearBasket = () => {
    setBasket([]);
  };

  return (
    <div>
      <h2>Shopping Basket</h2>
      {basket.length > 0 ? (
        basket.map((item) => (
          <div key={`${item.eventId}-${item.id}-${item.price}`}>
            <p>
              {selectedEventName} - {item.name} - {item.price}€ x{" "}
              {item.quantity}
            </p>
          </div>
        ))
      ) : (
        <p>Your basket is empty.</p>
      )}
      <div>
        Total:{" "}
        {basket
          .reduce((total, item) => total + item.price * item.quantity, 0)
          .toFixed(2)}
        €
      </div>
      <button onClick={handleConfirmSale}>Confirm sale</button>
      <button onClick={handleClearBasket}>Clear basket</button>
      {soldTicketsData && (
        <div>
          <p>Sale successful!</p>
          <p>Sale posted at: {soldTicketsData.paidAt}</p>
          <p>Sold by user: {soldTicketsData.userId}</p>
        </div>
      )}
    </div>
  );
}
