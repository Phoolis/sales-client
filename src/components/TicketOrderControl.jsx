import Button from "@mui/material/Button";

import { useEffect, useState } from "react";
import { fetchTicketTypes } from "../util/api";
import { useSettings } from "./SettingsContext";
import { useBasket } from "./BasketContext";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  InputAdornment,
} from "@mui/material";

export default function TicketOrderControl({
  selectedEventId,
  selectedEventName,
  selectedTicketTypeId,
  setSelectedTicketTypeId,
}) {
  const settings = useSettings(); // url and auth header info
  const [ticketTypes, setTicketTypes] = useState([]);
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
      setAmount(1);
    } else {
      setSelectedTicketType(null); // Clear if no valid selection
      setPrice(0);
      setAmount(1);
    }
  }, [selectedTicketTypeId, ticketTypes]);

  const handleAddToBasket = (
    ticketType,
    quantity,
    price,
    selectedEventName
  ) => {
    if (!selectedEventName && ticketType == null) {
      alert("Please select event and ticket type!");
    } else if (!selectedEventName) {
      alert("Please select event!");
    } else if (ticketType == null) {
      alert("Please select ticket type!");
    } else {
      addToBasket(ticketType, quantity, price, selectedEventName);
    }
  };

  const handlePriceChange = (e) => {
    const newPrice = Number(e.target.value);
    if (newPrice >= 0) {
      setPrice(newPrice);
    } else {
      setPrice(0);
    }
  };

  const handleAmountChange = (e) => {
    const input = e.target.value;
    let newAmount = 1;
    try {
      newAmount = parseInt(input);
    } catch (error) {
      setAmount(1);
    }
    if (newAmount >= 1) {
      setAmount(newAmount);
    } else {
      setAmount(1);
    }
  };

  return (
    <Stack>
      <>
        <FormControl fullWidth>
          <InputLabel>Ticket type</InputLabel>
          <Select
            id="ticketTypeSelect"
            value={selectedTicketTypeId}
            onChange={handleChange}
            label="Ticket type"
          >
            <MenuItem value={0}>Select ticket type</MenuItem>
            {ticketTypes.map((ticketType) => (
              <MenuItem key={ticketType.id} value={ticketType.id}>
                {ticketType.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </>
      <>
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell>Ticket type</TableCell>
              <TableCell>{selectedTicketType?.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Retail price</TableCell>
              <TableCell>{selectedTicketType?.retailPrice} €</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Available</TableCell>
              <TableCell>{selectedTicketType?.totalAvailable}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <TextField
                  label="Price"
                  type="number"
                  value={price}
                  onChange={handlePriceChange}
                  slotProps={{
                    htmlInput: {
                      step: 0.01,
                      min: 0,
                    },
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">€</InputAdornment>
                      ),
                    },
                  }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  label="Amount"
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  slotProps={{
                    htmlInput: {
                      min: 1,
                      step: 1,
                    },
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">tickets</InputAdornment>
                      ),
                    },
                  }}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Button
          color="primary"
          variant="contained"
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
        </Button>
      </>
    </Stack>
  );
}
