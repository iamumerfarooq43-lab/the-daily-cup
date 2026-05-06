import api from "./axiosConfig";

// Customer: place a new order
export const createOrder = async (orderPayload) => {
  const { data } = await api.post("/orders", orderPayload);
  return data;
};

// Customer: get their own orders
export const getMyOrders = async () => {
  const { data } = await api.get("/orders/mine");
  return data;
};

// Merchant: get all orders
export const getAllOrders = async () => {
  const { data } = await api.get("/orders");
  return data;
};

// Merchant: update order status
export const updateOrderStatus = async (id, status) => {
  const { data } = await api.put(`/orders/${id}`, { status });
  return data;
};