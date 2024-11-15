import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import Container from "@mui/material/Container";
import TicketSales from "./TicketSales";
import { SettingsProvider } from "./components/SettingsContext";
import { BasketProvider } from "./components/BasketContext";

function App() {
  return (
    <SettingsProvider>
      <BasketProvider>
        <Container maxWidth="xl">
          <TicketSales />
        </Container>
      </BasketProvider>
    </SettingsProvider>
  );
}

export default App;
