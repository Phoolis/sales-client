// STUB shopping basket for tickets
// tickettypes, amounts, and prices selected for the sale are displayed here
import { useBasket } from "./BasketContext";

export default function Basket({ selectedEventName }) {
  const { basket } = useBasket();

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
    </div>
  );
}
