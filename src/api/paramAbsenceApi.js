// src/api/paramAbsenceApi.js
import axios from "axios";

const BASE_URL = "/api/types-absences";

export const getAllTypeAbsences = async () => {
  const res = await axios.get(BASE_URL);
  return res.data;
};

export const getTypeAbsenceById = async (id) => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};

export const createTypeAbsence = async (payload) => {
  const res = await axios.post(BASE_URL, payload);
  return res.data;
};

export const updateTypeAbsence = async (id, payload) => {
  const res = await axios.put(`${BASE_URL}/${id}`, payload);
  return res.data;
};

export const deleteTypeAbsence = async (id) => {
  await axios.delete(`${BASE_URL}/${id}`);
};
