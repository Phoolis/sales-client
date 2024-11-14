import { createContext, useContext } from "react";

const SettingsContext = createContext();

export const useSettings = () => {
  return useContext(SettingsContext);
};

export const SettingsProvider = ({ children }) => {
  const settings = {
    //url: "http://localhost:8080/api",
    url: "https://ticketguru.hellmanstudios.fi/api",
    userName: "salesperson@test.com",
    userPass: "salesperson",
  };
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
};
