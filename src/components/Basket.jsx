import Button from "@mui/material/Button";
import { Add, DeleteForever, Remove } from "@mui/icons-material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { useBasket } from "./BasketContext";
import { postBasketItems } from "../util/api";
import { useSettings } from "./SettingsContext";
import { useState, useMemo } from "react";
import "@fontsource/roboto";

export default function Basket({ setSoldTicketsData, setSelectedEventId, setSelectedTicketTypeId}) {
  const { basket, setBasket, removeFromBasket, plusOneTicket, minusOneTicket } =
    useBasket();
  const settings = useSettings();

  const [columnDefs, setColumnDefs] = useState([
    { field: "eventName" },
    { field: "name", width: 120 },
    { field: "price", width: 100 },
    { field: "quantity", width: 100 },
    {
      headerName: "Subtotal (€)",
      width: 100,
      valueGetter: (params) => params.data.price * params.data.quantity,
      valueFormatter: (params) => params.value.toFixed(2),
    },
    {
      headerName: "",
      cellRenderer: (params) => (
        <>
          <Button color='primary' onClick={() => plusOneTicket(params.data)}>
            <Add />
          </Button>
          <Button
            color={params.data.quantity != 1 ? "primary" : "gray"}
            onClick={() => minusOneTicket(params.data)}>
            <Remove />
          </Button>
          <Button color='error' onClick={() => removeFromBasket(params.data)}>
            <DeleteForever />
          </Button>
        </>
      ),
    },
  ]);

  const autoSizeStrategy = {
    type: "fitGridWidth",
  };

  const handleConfirmSale = async () => {
    if (!basket || basket.length === 0) return;
    try {
      const response = await postBasketItems(settings, basket);
      if (response.status === 201) {
        setSoldTicketsData(response.data);
        handleClearBasket();
        setSelectedEventId(0);
        setSelectedTicketTypeId(0);
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
      <div className='ag-theme-material' style={{ height: "100%" }}>
        <AgGridReact
          rowData={basket}
          columnDefs={columnDefs}
          domLayout='autoHeight'
          groupTotalRow={true}
          autoSizeStrategy={autoSizeStrategy}
        />
      </div>
      <div
        style={{ textAlign: "right", marginTop: "10px", fontWeight: "bold", fontFamily: "Roboto"}}>
        Grand Total: {grandTotal}€
      </div>
      <Button color='success' variant='contained' onClick={handleConfirmSale}>
        Confirm sale
      </Button>
      <Button color='error' onClick={handleClearBasket}>
        Clear basket
      </Button>
    </>
  );
}
