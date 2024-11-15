import { createContext, useContext, useState } from "react";

const BasketContext = createContext();

export const useBasket = () => useContext(BasketContext);

export const BasketProvider = ({ children }) => {
  const [basket, setBasket] = useState([]);

  const addToBasket = (ticketType, quantity, price, eventName) => {
    setBasket((prevBasket) => {
      // check if identical ticket type with identical price is already in the basket
      const existingItem = prevBasket.find(
        (item) =>
          item.id === ticketType.id &&
          item.eventId === ticketType.eventId &&
          item.price === price
      );
      // if above, add that ticket type by quantity
      if (existingItem) {
        return prevBasket.map((item) =>
          item.id === ticketType.id &&
          item.eventId === ticketType.eventId &&
          item.price === price
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        // else, add new ticket type item to basket
      } else {
        return [
          ...prevBasket,
          {
            ...ticketType,
            quantity: quantity,
            price: price,
            eventName: eventName,
          },
        ];
      }
    });
  };

  //TODO: Add way to remove item from basket
  const removeFromBasket = (id) => {
    setBasket((prevBasket) => prevBasket.filter((item) => item.id !== id));
  };

  return (
    <BasketContext.Provider
      value={{ basket, setBasket, addToBasket, removeFromBasket }}>
      {children}
    </BasketContext.Provider>
  );
};
