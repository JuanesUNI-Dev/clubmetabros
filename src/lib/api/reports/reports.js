// src/lib/api/reports/reports.js
import { apiClient } from "@/lib/ApiClient";

const BASE_URL = "https://express-orcin-three.vercel.app/report"; // Ajusta si usas env

/**
 * Descargar reporte en formato Excel
 * GET /report/export
 */
export async function exportReport() {
  try {
    const response = await fetch(`${BASE_URL}/export`, {
      method: "GET",
      credentials: "include", // obligatorio porque usa token por cookie
    });

    if (!response.ok) {
      throw new Error("Error exportando el reporte");
    }

    // Excel viene como archivo binario → Blob
    const blob = await response.blob();

    return {
      success: true,
      file: blob,
    };
  } catch (error) {
    console.error("❌ Error exportando reporte:", error);
    return {
      success: false,
      message: error.message,
    };
  }
}
