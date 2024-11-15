import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import Container from "@mui/material/Container";
import TicketSales from "./TicketSales";
import { SettingsProvider } from "./components/SettingsContext";
import { BasketProvider } from "./components/BasketContext";
import { AppBar, Toolbar, Typography } from "@mui/material";

function App() {
  return (
    <SettingsProvider>
      <BasketProvider>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">TicketGuru</Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="xl" sx={{ mt: 3, mb: 1 }}>
          <TicketSales />
        </Container>
      </BasketProvider>
    </SettingsProvider>
  );
}

export default App;
