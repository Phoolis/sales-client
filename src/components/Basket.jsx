import Button from "@mui/material/Button";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { useBasket } from "./BasketContext";
import { postBasketItems } from "../util/api";
import { useSettings } from "./SettingsContext";
import { useState, useMemo } from "react";

export default function Basket({ setSoldTicketsData }) {
  const { basket, setBasket } = useBasket();
  const settings = useSettings();

  const [columnDefs, setColumnDefs] = useState([
    { field: "eventName" },
    { field: "name" },
    { field: "price" },
    { field: "quantity" },
    {
      headerName: "Subtotal (€)",
      valueGetter: (params) => params.data.price * params.data.quantity,
      valueFormatter: (params) => params.value.toFixed(2),
    },
  ]);

  const handleConfirmSale = async () => {
    try {
      const response = await postBasketItems(settings, basket);
      if (response.status === 201) {
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

  const grandTotal = useMemo(() => {
    return basket
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  }, [basket]);

  return (
    <>
      <div
        style={{ textAlign: "right", marginTop: "10px", fontWeight: "bold" }}
      >
        Grand Total: {grandTotal}€
      </div>
      <div className="ag-theme-material" style={{ height: 400 }}>
        <AgGridReact
          rowData={basket}
          columnDefs={columnDefs}
          groupTotalRow={true}
        />
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
