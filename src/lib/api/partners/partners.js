// src/lib/api/partner/partner.js
import { apiClient } from "@/lib/ApiClient";

const BASE_URL = "https://backdemet.bskcfv.online/partner"; // backend partners

// ---------------------------------------------------------------------
// GET — Obtener todos los socios
// ---------------------------------------------------------------------
export async function getPartners() {
  try {
    const res = await apiClient(`${BASE_URL}/get`, {
      cache: "no-store",
      credentials: "include",
    });
    return await res.json();
  } catch (err) {
    console.error("Error getPartners:", err);
    return null;
  }
}

// ---------------------------------------------------------------------
// POST — Registrar socio
// body esperado:
// { id, name, email, phoneNumber, cedula }
// ---------------------------------------------------------------------
export async function registerPartner(data) {
  try {
    const res = await apiClient(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (err) {
    console.error("Error registerPartner:", err);
    return null;
  }
}

// ---------------------------------------------------------------------
// PUT — Actualizar socio
// mismo body que register: { id, name, email, phoneNumber, cedula }
// ---------------------------------------------------------------------
export async function updatePartner(data) {
  try {
    const res = await apiClient(`${BASE_URL}/update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (err) {
    console.error("Error updatePartner:", err);
    return null;
  }
}

// ---------------------------------------------------------------------
// DELETE — Eliminar Socio
// body esperado: { id, email }
// ---------------------------------------------------------------------
export async function deletePartner(id, email) {
  try {
    const res = await apiClient(`${BASE_URL}/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id, email }),
    });

    return await res.json();
  } catch (err) {
    console.error("Error deletePartner:", err);
    return null;
  }
}

// ---------------------------------------------------------------------
// POST — Verificar socio
// body esperado: { v_idPartner }
// ---------------------------------------------------------------------
// lib/api/partners/partners.js
export async function verifyPartner(v_idPartner) {
  try {
    const res = await fetch(`${BASE_URL}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ v_idPartner }), // ahora v_idPartner es un string
    });

    return await res.json();
  } catch (err) {
    console.error("Error verifyPartner:", err);
    return null;
  }
}


