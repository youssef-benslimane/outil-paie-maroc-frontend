// src/api/BaremIRApi.js
import axios from "axios";

const BASE_URL = "/api/baremes-ir";

export const getAllBaremesIR = async () => {
  const res = await axios.get(BASE_URL);
  return res.data;
};

export const getBaremeIRById = async (id) => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};

export const createBaremeIR = async (payload) => {
  const res = await axios.post(BASE_URL, payload);
  return res.data;
};

export const updateBaremeIR = async (id, payload) => {
  const res = await axios.put(`${BASE_URL}/${id}`, payload);
  return res.data;
};

export const deleteBaremeIR = async (id) => {
  await axios.delete(`${BASE_URL}/${id}`);
};
