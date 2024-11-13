import axios from "axios";

const fetchEvents = async ({ url, userName, userPass }) => {
  try {
    const response = await axios.get(`${url}/events`, {
      headers: {
        Authorization: `Basic ${btoa(`${userName}:${userPass}`)}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error fetching events: ", error);
  }
};

const fetchTicketTypes = async (settings, params) => {
  const { url, userName, userPass } = settings;
  try {
    const response = await axios.get(`${url}/tickettypes/search`, {
      headers: {
        Authorization: `Basic ${btoa(`${userName}:${userPass}`)}`,
      },
      params: params,
    });
    return response.data;
  } catch (error) {
    console.log("Error fetching ticket types: ", error);
  }
};

export { fetchEvents, fetchTicketTypes };
