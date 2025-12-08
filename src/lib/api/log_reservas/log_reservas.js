import { apiClient } from "@/lib/ApiClient";

const BASE_URL = "https://backend-demet.onrender.com/log/reserve"; // backend

export async function getLogs() {
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