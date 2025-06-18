// src/api/paramCotisationsApi.js
import axios from "axios";

// Mapping des clés entité → endpoint REST
const entityApiMap = {
  typeCot: "type-cotisations",
  cotisation: "cotisations",
};

const resolveEntity = (entity) => entityApiMap[entity] || entity;

export const getAll = async (entity) => {
  const apiEntity = resolveEntity(entity);
  const res = await axios.get(`/api/${apiEntity}`);
  return res.data;
};

export const getOne = async (entity, id) => {
  const apiEntity = resolveEntity(entity);
  const res = await axios.get(`/api/${apiEntity}/${id}`);
  return res.data;
};

export const createOne = async (entity, payload) => {
  const apiEntity = resolveEntity(entity);
  const res = await axios.post(`/api/${apiEntity}`, payload);
  return res.data;
};

export const updateOne = async (entity, id, payload) => {
  const apiEntity = resolveEntity(entity);
  const res = await axios.put(`/api/${apiEntity}/${id}`, payload);
  return res.data;
};

export const deleteOne = async (entity, id) => {
  const apiEntity = resolveEntity(entity);
  await axios.delete(`/api/${apiEntity}/${id}`);
};
