import "./App.css";
import TicketSales from "./components/TicketSales";
import { SettingsProvider } from "./components/SettingsContext";
import { BasketProvider } from "./components/BasketContext";

function App() {
  return (
    <SettingsProvider>
      <BasketProvider>
        <TicketSales />
      </BasketProvider>
    </SettingsProvider>
  );
}

export default App;
