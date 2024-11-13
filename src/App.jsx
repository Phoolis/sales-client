import "./App.css";
import TicketSales from "./components/TicketSales";
import { SettingsProvider } from "./util/SettingsContext";

function App() {
  return (
    <SettingsProvider>
      <TicketSales />
    </SettingsProvider>
  );
}

export default App;
