import axios from "axios";

export const fetchNotifications = async () => {
  const response = await axios.get("/api/notifications");
  return response.data;
};

export const respondToOffer = async (notificationId, response) => {
  await axios.post(`/api/notifications/respond`, { notificationId, response });
};
