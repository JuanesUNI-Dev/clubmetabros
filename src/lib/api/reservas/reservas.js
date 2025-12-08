// src/lib/api/reservas/reservas.js
import { apiClient } from "@/lib/ApiClient";

const BASE_URL = "https://backdemet.bskcfv.online/reserve"; // backend

// =============================
// GET: Obtener todas las reservas
// =============================
export async function getReservas() {
  try {
    const res = await apiClient(`${BASE_URL}/get`, {
      cache: "no-store",
      credentials: "include",
    });
    return await res.json();
  } catch (err) {
    console.error("Error getReservas:", err);
    return null;
  }
}

// =============================
// POST: Registrar reserva
// =============================
export async function registerReserva(data) {
  try {
    const res = await apiClient(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.error("Error registerReserva:", err);
    return null;
  }
}

// =============================
// PUT: Actualizar reserva
// =============================
export async function updateReserva(data) {
  try {
    const res = await apiClient(`${BASE_URL}/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.error("Error updateReserva:", err);
    return null;
  }
}

// =============================
// DELETE: Eliminar reserva
// =============================
export async function deleteReserva(id_reservation) {
  try {
    const res = await apiClient(`${BASE_URL}/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ v_id_reservation: id_reservation }),
    });
    return await res.json();
  } catch (err) {
    console.error("Error deleteReserva:", err);
    return null;
  }
}

// =============================
// LEGACY: No borrar — mantener por compatibilidad si lo estás usando
// =============================
export async function updateReservaStatus(id_request, email) {
  try {
    const res = await apiClient(`${BASE_URL}/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ v_id_request: id_request, v_email: email, v_status: "FINALIZADO" }),
    });
    return await res.json();
  } catch (err) {
    console.error("Error updateReservaStatus:", err);
    return null;
  }
}
