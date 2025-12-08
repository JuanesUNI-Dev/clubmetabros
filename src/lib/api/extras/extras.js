// src/lib/api/extra/extra.js
import { apiClient } from "@/lib/ApiClient";

const BASE_URL = "https://backdemet.bskcfv.online/extra"; // backend extras

// ---------------------------------------------------------------------
// GET — Obtener todos los extras
// ---------------------------------------------------------------------
export async function getExtras() {
  try {
    const res = await apiClient(`${BASE_URL}/get`, {
      cache: "no-store",
      credentials: "include",
    });

    return await res.json();
  } catch (err) {
    console.error("Error getExtras:", err);
    return null;
  }
}

// ---------------------------------------------------------------------
// POST — Registrar extra
// body esperado:
// { v_name, v_value_add, v_quantity }
// ---------------------------------------------------------------------
export async function registerExtra(data) {
  try {
    const res = await apiClient(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (err) {
    console.error("Error registerExtra:", err);
    return null;
  }
}

// ---------------------------------------------------------------------
// PUT — Actualizar extra
// body esperado:
// { v_id_extra, v_name, v_value_add, v_quantity }
// ---------------------------------------------------------------------
export async function updateExtra(data) {
  try {
    const res = await apiClient(`${BASE_URL}/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (err) {
    console.error("Error updateExtra:", err);
    return null;
  }
}

// ---------------------------------------------------------------------
// DELETE — Eliminar extra
// body esperado:
// { v_id_extra }
// ---------------------------------------------------------------------
export async function deleteExtra(v_id_extra) {
  try {
    const res = await apiClient(`${BASE_URL}/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ v_id_extra }),
    });

    return await res.json();
  } catch (err) {
    console.error("Error deleteExtra:", err);
    return null;
  }
}
