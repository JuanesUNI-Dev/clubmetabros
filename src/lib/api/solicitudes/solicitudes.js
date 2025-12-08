// src/lib/api/solicitudes/solicitudes.js
import { apiClient } from "@/lib/ApiClient";

const BASE_URL = "http://localhost:3002/request"; // tu backend

export async function getSolicitudes() {
  try {
    const res = await apiClient(`${BASE_URL}/get`, {
      cache: "no-store",
      credentials: "include", // envía cookie automáticamente
    });
    return await res.json();
  } catch (err) {
    console.error("Error getReservas:", err);
    return null;
  }
}

export async function updateReservaStatus(id_request, email) {
  try {
    const res = await apiClient(`${BASE_URL}/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // envía cookie automáticamente
      body: JSON.stringify({ v_id_request: id_request, v_email: email }),
    });

    return await res.json();
  } catch (err) {
    console.error("Error updateReservaStatus:", err);
    return null;
  }
}
// --- Obtener cotización de precio ---
export async function getPrice({ v_init_date, v_end_date, v_fk_rate }) {
  try {
    const res = await apiClient(`${BASE_URL}/price`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ v_init_date, v_end_date, v_fk_rate }),
    });

    return await res.json(); // { result: number }
  } catch (err) {
    console.error("Error getPrice:", err);
    return null;
  }
}

// --- Registrar nueva solicitud ---
export async function registerSolicitud(data) {
  try {
    const res = await apiClient(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return await res.json(); // { message, etc }
  } catch (err) {
    console.error("Error registerSolicitud:", err);
    return null;
  }
}

export async function deleteSolicitud(id_request) {
  try {
    const res = await apiClient(`${BASE_URL}/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ v_id_request: id_request }),
    });

    return await res.json(); // { message: "Solicitud Eliminada Correctamente" }
  } catch (err) {
    console.error("Error deleteSolicitud:", err);
    return null;
  }
}
