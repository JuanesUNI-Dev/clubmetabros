// apiClient.js
export async function apiClient(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
  });

  // SI 401 → intentar refrescar token
  if (res.status === 401) {
    console.log("Access token expiró. Intentando refresh...");

    const refreshRes = await fetch("http://localhost:3002/intern/refresh", {
      method: "GET",
      credentials: "include",
    });

    // Si refresh NO sirve → sacar al login
    if (!refreshRes.ok) {
      window.location.href = "/login";
      return;
    }

    // Si refresh sí sirvió → repetir petición original
    return fetch(url, {
      ...options,
      credentials: "include",
    });
  }

  return res;
}
