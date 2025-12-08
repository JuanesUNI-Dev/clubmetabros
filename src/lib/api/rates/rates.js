// src/lib/api/rates/rates.js
import { apiClient } from "@/lib/ApiClient";

const BASE_URL = "https://express-orcin-three.vercel.app/rate"; // ruta base del backend

// -------------------------------------------
// GET ALL RATES
// -------------------------------------------
export async function getRates() {
  try {
    const res = await apiClient(`${BASE_URL}/get`, {
      cache: "no-store",
    });

    return await res.json();
  } catch (err) {
    console.error("Error getRates:", err);
    return null;
  }
}

// -------------------------------------------
// REGISTER RATE
// -------------------------------------------
// payload debe seguir el esquema RateRegister
// {
//   v_name, v_pax, v_value4, v_value8, v_value_extra,
//   v_isPartner, v_idSpace
// }
export async function createRate(payload) {
  try {
    const res = await apiClient(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    return await res.json();
  } catch (err) {
    console.error("Error createRate:", err);
    return null;
  }
}

// -------------------------------------------
// UPDATE RATE
// -------------------------------------------
// payload debe seguir el esquema RateUpdate
// {
//   v_id_rate, v_name, v_pax,
//   v_value4, v_value8, v_value_extra
// }
export async function updateRate(payload) {
  try {
    const res = await apiClient(`${BASE_URL}/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    return await res.json();
  } catch (err) {
    console.error("Error updateRate:", err);
    return null;
  }
}

// -------------------------------------------
// DELETE RATE
// -------------------------------------------
// necesita { v_id_rate }
export async function deleteRate(v_id_rate) {
  try {
    const res = await apiClient(`${BASE_URL}/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ v_id_rate }),
    });

    return await res.json();
  } catch (err) {
    console.error("Error deleteRate:", err);
    return null;
  }
}
