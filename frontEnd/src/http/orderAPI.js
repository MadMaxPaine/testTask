import { $host } from "./index";

export const getOrders = async (id) => {
  const { data } = await $host.get("api/orders"+id,{params:{userId:id}});
  return data;
};

export const createOrder = async (reqData) => {
    const { data } = await $host.post("api/orders", reqData);
    return data;
  };