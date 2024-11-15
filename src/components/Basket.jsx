import Button from "@mui/material/Button";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { useBasket } from "./BasketContext";
import { postBasketItems } from "../util/api";
import { useSettings } from "./SettingsContext";
import { useState } from "react";

export default function Basket({ setSoldTicketsData }) {
  const { basket, setBasket } = useBasket();
  const settings = useSettings();

  const [columnDefs, setColumnDefs] = useState([
    { field: "eventName" },
    { field: "name" },
    { field: "price" },
    { field: "quantity" },
  ]);

  const handleConfirmSale = async () => {
    try {
      const response = await postBasketItems(settings, basket);
      console.log(response);
      if (response.status === 201) {
        console.log(response.data);
        setSoldTicketsData(response.data);
        handleClearBasket();
      }
    } catch (error) {
      console.error("Error posting basket: ", error);
    }
  };

  const handleClearBasket = () => {
    setBasket([]);
  };

  return (
    <>
      <div className="ag-theme-material" style={{ height: 500 }}>
        {console.log(basket)}
        <AgGridReact rowData={basket} columnDefs={columnDefs} />
      </div>
      <div>
        Total:{" "}
        {basket
          .reduce((total, item) => total + item.price * item.quantity, 0)
          .toFixed(2)}
        €
      </div>
      <Button color="success" variant="contained" onClick={handleConfirmSale}>
        Confirm sale
      </Button>
      <Button color="error" onClick={handleClearBasket}>
        Clear basket
      </Button>
    </>
  );
}
