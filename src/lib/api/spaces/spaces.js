import { apiClient } from "@/lib/ApiClient";

// src/lib/api/spaces/spaces.js
const BASE_URL = "http://localhost:3002/space";

// GET ALL
export async function getSpaces() {
  try {
    const res = await fetch(`${BASE_URL}/get`, { cache: "no-store" });
    return await res.json();
  } catch (err) {
    console.error("Error getSpaces:", err);
    return null;
  }
}

// GET BY ID
export async function getSpaceById(id_rate) {
  try {
    const res = await fetch(`${BASE_URL}/get/${id_rate}`, {
      cache: "no-store",
    });
    return await res.json();
  } catch (err) {
    console.error("Error getSpaceById:", err);
    return null;
  }
}

// CREATE
export async function createSpace(payload) {
  try {
    const res = await apiClient(`${BASE_URL}/register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return await res.json();
  } catch (err) {
    console.error("Error createSpace:", err);
    return null;
  }
}

// UPDATE
export async function updateSpace(payload) {
  try {
    const res = await apiClient(`${BASE_URL}/update`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return await res.json();
  } catch (err) {
    console.error("Error updateSpace:", err);
    return null;
  }
}

// DELETE (por nombre)
export async function deleteSpace(v_name) {
  try {
    const res = await apiClient(`${BASE_URL}/delete`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ v_name }),
    });

    return await res.json();
  } catch (err) {
    console.error("Error deleteSpace:", err);
    return null;
  }
}
// OBTENER FECHAS OCUPADAS DE UN ESPACIO
export async function getOccupiedSpaces(v_space) {
  try {
    const res = await apiClient(`${BASE_URL}/occupied`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ v_space }),
    });

    return await res.json();
  } catch (err) {
    console.error("Error getOccupiedSpaces:", err);
    return null;
  }
}