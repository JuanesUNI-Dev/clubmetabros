// src/lib/api/Auth/users.js
import { apiClient } from "@/lib/ApiClient";

const BASE_URL = "https://backdemet.bskcfv.online/intern";

/* ---------------------------------------------------
   Helper para manejar respuestas del backend
---------------------------------------------------- */
async function handleResponse(res) {
  let data = {};

  try {
    data = await res.json();
  } catch (e) {
    data = { message: "Respuesta no válida del servidor" };
  }

  return {
    ok: res.ok,
    data,
  };
}

/* ---------------------------------------------------
   LOGIN
---------------------------------------------------- */
export async function postLogin(payload) {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      credentials: "include", // recibe cookies
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return await handleResponse(res);
  } catch (err) {
    console.error("Error postLogin:", err);
    return { ok: false, data: { message: "Error de conexión" } };
  }
}

/* ---------------------------------------------------
   REGISTER
---------------------------------------------------- */
export async function postRegister(payload) {
  try {
    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return await handleResponse(res);
  } catch (err) {
    console.error("Error postRegister:", err);
    return { ok: false, data: { message: "Error de conexión" } };
  }
}

/* ---------------------------------------------------
   ME — obtener datos del usuario actual
---------------------------------------------------- */
export async function getMe() {
  try {
    const res = await fetch(`${BASE_URL}/me`, {
      method: "GET",
      credentials: "include",
    });

    return await handleResponse(res);
  } catch (err) {
    console.error("Error getMe:", err);
    return { ok: false, data: { message: "Error de conexión" } };
  }
}

/* ---------------------------------------------------
   LOGOUT
---------------------------------------------------- */
export async function logout() {
  try {
    const res = await fetch(`${BASE_URL}/logout`, {
      method: "GET",
      credentials: "include",
    });

    return await handleResponse(res);
  } catch (err) {
    console.error("Error logout:", err);
    return { ok: false, data: { message: "Error de conexión" } };
  }
}

export async function getInternos() {
  try {
    const res = await apiClient(`${BASE_URL}/get`, {
      cache: "no-store",
      credentials: "include", // envía cookie automáticamente
    });
    return await res.json();
  } catch (err) {
    console.error("Error get Internos:", err);
    return null;
  }
}

/* ---------------------------------------------------
   PUT: Actualizar datos de un empleado
---------------------------------------------------- */
export async function updateIntern(payload) {
  try {
    const res = await fetch(`${BASE_URL}/update`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return await handleResponse(res);
  } catch (err) {
    console.error("Error updateIntern:", err);
    return { ok: false, data: { message: "Error de conexión" } };
  }
}

/* ---------------------------------------------------
   DELETE: Eliminar un empleado
---------------------------------------------------- */
export async function deleteIntern(idEmployee) {
  try {
    const res = await fetch(`${BASE_URL}/delete`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ v_idEmployee: idEmployee }),
    });

    return await handleResponse(res);
  } catch (err) {
    console.error("Error deleteIntern:", err);
    return { ok: false, data: { message: "Error de conexión" } };
  }
}
