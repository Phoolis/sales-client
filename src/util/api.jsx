import axios from "axios";

const url = "https://ticketguru.hellmanstudios.fi/api";

const userName = "";
const userPass = "";

const authToken = btoa(`${userName}:${userPass}`);
axios.defaults.headers.common["Authorization"] = `Basic ${authToken}`;

const fetchEvents = async () => {
  try {
    const response = await axios.get(url + "/events");
    return response.data;
  } catch (error) {
    console.log("Error fetching events: ", error);
  }
};

const fetchTicketTypes = async ({ params }) => {
  try {
    const response = await axios.get(url + "/tickettypes/search", { params });
    return response.data;
  } catch (error) {
    console.log("Error fetching ticket types: ", error);
  }
};

export { fetchEvents };
