// lib/api/stadistics/stadistics.js

const BASE_URL = "https://express-orcin-three.vercel.app";

async function apiGet(path) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Error en ${path}: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("API ERROR:", error);
    throw error;
  }
}

// 📊 Solicitudes por fecha
export function requestByDate() {
  return apiGet("/stadistics/requestByDate");
}

// 📊 Solicitudes por espacio
export function requestBySpace() {
  return apiGet("/stadistics/requestBySpace");
}

// 🟦 Reservas por fecha
export function reserveByDate() {
  return apiGet("/stadistics/reserveByDate");
}

// 🟩 Reservas por espacio
export function reserveBySpace() {
  return apiGet("/stadistics/reserveBySpace");
}

// 💰 Ventas totales
export function totalSales() {
  return apiGet("/stadistics/totalsales");
}

// 💵 Valores por fecha
export function valuesByDate() {
  return apiGet("/stadistics/valuesByDate");
}

// 📆 Valores por mes
export function valuesByMonth() {
  return apiGet("/stadistics/valuesByMonth");
}
