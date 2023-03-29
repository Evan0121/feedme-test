import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000";

export const listBot = async () => {
  try {
    return axios.get("/bot/list");
  } catch (error) {
    return false;
  }
};

export const addBot = async () => {
  try {
    return axios.post("/bot/add");
  } catch (error) {
    return false;
  }
};

export const removeBot = async (payload) => {
  try {
    return axios.post("/bot/remove", payload);
  } catch (error) {
    return false;
  }
};

export const listOrder = async () => {
  try {
    return axios.get("/order/list");
  } catch (error) {
    return false;
  }
};

export const addOrder = async (payload) => {
  try {
    return axios.post("/order/add", payload);
  } catch (error) {
    return false;
  }
};
