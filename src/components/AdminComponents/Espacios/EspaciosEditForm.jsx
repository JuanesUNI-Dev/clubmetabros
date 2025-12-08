'use client';

import { useState } from "react";
import { updateSpace } from "@/lib/api/spaces/spaces";

export default function EspaciosEditForm({ espacio, onBack, onUpdated }) {

  // 🔥 Aseguramos que v_url_img sea string, aunque venga como array
  const [form, setForm] = useState({
    v_id_rate: espacio.id_rate,
    v_name: espacio.name || "",
    v_descrip: espacio.descrip || "",
    v_pax: espacio.pax || "",

    // si viene array → lo transformamos a "url1, url2, url3"
    v_url_img: Array.isArray(espacio.url_img)
      ? espacio.url_img.join(", ")
      : espacio.url_img || "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {

      // 🔥 Convertir string a array (igual que en el create)
      const imagenesArray = form.v_url_img
        .split(",")
        .map(url => url.trim())
        .filter(url => url.length > 0);

      const payload = {
        v_id_rate: Number(form.v_id_rate),
        v_name: form.v_name,
        v_descrip: form.v_descrip,
        v_pax: Number(form.v_pax),

        // 🔥 CAMPOS QUE SE TOMAN DEL ESPACIO ORIGINAL
        v_value4: Number(espacio.value_4_hours),
        v_value8: Number(espacio.value_8_hours),
        v_value_extra: Number(espacio.value_extra_hour),

        // 🔥 Enviamos arreglo de URLs
        v_url_img: imagenesArray,
      };

      const res = await updateSpace(payload);

      if (res.error) throw new Error(res.error);

      setMsg("✔ Espacio actualizado correctamente");

      if (onUpdated) onUpdated();
      setTimeout(() => {
        if (onBack) onBack();
      }, 1200);

    } catch (err) {
      setMsg("❌ " + err.message);
    }

    setLoading(false);
  }

  return (
    <div className="p-6 border rounded-xl bg-white shadow border-[rgb(210,190,160)]">
      <h2 className="text-2xl font-bold mb-4">Editar Espacio</h2>

      {msg && (
        <div className="p-2 mb-3 text-center rounded-xl bg-gray-100 border">
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* NOMBRE */}
        <div>
          <label className="font-semibold">Nombre del espacio</label>
          <input
            type="text"
            name="v_name"
            className="w-full p-2 border rounded-lg mt-1"
            value={form.v_name}
            onChange={handleChange}
            required
          />
        </div>

        {/* DESCRIPCIÓN */}
        <div>
          <label className="font-semibold">Descripción</label>
          <textarea
            name="v_descrip"
            className="w-full p-2 border rounded-lg mt-1"
            rows={3}
            value={form.v_descrip}
            onChange={handleChange}
            required
          />
        </div>

        {/* PAX */}
        <div>
          <label className="font-semibold">Capacidad (Pax)</label>
          <input
            type="number"
            name="v_pax"
            className="w-full p-2 border rounded-lg mt-1"
            value={form.v_pax}
            onChange={handleChange}
            required
          />
        </div>

        {/* IMÁGENES */}
        <div>
          <label className="font-semibold">URLs de imágenes (separadas por coma)</label>
          <input
            type="text"
            placeholder="url1.jpg, url2.png, url3.webp"
            className="w-full p-2 border rounded"
            value={form.v_url_img}
            onChange={e => setForm({ ...form, v_url_img: e.target.value })}
          />
        </div>

        {/* BOTONES */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700"
        >
          {loading ? "Guardando..." : "Actualizar Espacio"}
        </button>

        <button
          type="button"
          onClick={onBack}
          className="w-full mt-2 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}
