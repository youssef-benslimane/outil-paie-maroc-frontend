import axios from "axios";

// Base URL pour les types d'absences
const BASE_URL = "/api/types-absences";

/**
 * Récupère tous les types d'absences
 * @returns {Promise<Array>} liste des types d'absences
 */
export const getAllTypeAbsences = async () => {
  const res = await axios.get(BASE_URL);
  return res.data;
};

/**
 * Récupère un type d'absence par son identifiant
 * @param {string} id - idTypeAbsence
 * @returns {Promise<Object>} type d'absence
 */
export const getTypeAbsenceById = async (id) => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};

/**
 * Crée un nouveau type d'absence
 * @param {Object} payload - données du type d'absence
 * @returns {Promise<Object>} type d'absence créé
 */
export const createTypeAbsence = async (payload) => {
  const res = await axios.post(BASE_URL, payload);
  return res.data;
};

/**
 * Met à jour un type d'absence existant
 * @param {string} id - idTypeAbsence
 * @param {Object} payload - données mises à jour
 * @returns {Promise<Object>} type d'absence mis à jour
 */
export const updateTypeAbsence = async (id, payload) => {
  const res = await axios.put(`${BASE_URL}/${id}`, payload);
  return res.data;
};

/**
 * Supprime un type d'absence
 * @param {string} id - idTypeAbsence
 * @returns {Promise<void>}
 */
export const deleteTypeAbsence = async (id) => {
  await axios.delete(`${BASE_URL}/${id}`);
};
