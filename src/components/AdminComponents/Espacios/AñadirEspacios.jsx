// src/components/AdminComponents/AñadirEspacios.jsx
'use client';
import { useState } from "react";
import { createSpace } from "@/lib/api/spaces/spaces";

export default function EspacioCreateForm({ onUpdate, onBack }) {
  const [form, setForm] = useState({
    v_name: "",
    v_descrip: "",
    v_pax: "",
    v_value4: "",
    v_value8: "",
    v_value_extra: "",
    v_url_img: "",
    v_isPartner: false,
  });

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    // Convertimos el string de URLs separadas por coma en un array
    const imagenesArray = form.v_url_img
      .split(",")
      .map(url => url.trim())
      .filter(url => url.length > 0); // eliminamos strings vacíos

    const payload = {
      ...form,
      v_pax: Number(form.v_pax),
      v_value4: Number(form.v_value4),
      v_value8: Number(form.v_value8),
      v_value_extra: Number(form.v_value_extra),
      v_url_img: imagenesArray, // enviamos como array
    };

    const res = await createSpace(payload);

    setLoading(false);

    if (onUpdate) onUpdate();   // 🔥 ACTUALIZA LISTA
    if (onBack) onBack();       // 🔥 CIERRA FORMULARIO
  }

  return (
    <div className="p-6 border rounded-xl bg-white shadow border-[rgb(210,190,160)]">
      <h2 className="text-2xl font-bold mb-4">Crear nuevo espacio</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          placeholder="Nombre"
          className="w-full p-2 border rounded"
          value={form.v_name}
          onChange={e => setForm({ ...form, v_name: e.target.value })}
        />

        <textarea
          placeholder="Descripción"
          className="w-full p-2 border rounded"
          rows="3"
          value={form.v_descrip}
          onChange={e => setForm({ ...form, v_descrip: e.target.value })}
        />

        <div className="grid grid-cols-3 gap-3">
          <input
            type="number"
            placeholder="Capacidad"
            className="p-2 border rounded"
            value={form.v_pax}
            onChange={e => setForm({ ...form, v_pax: e.target.value })}
          />

          <input
            type="number"
            placeholder="4 horas"
            className="p-2 border rounded"
            value={form.v_value4}
            onChange={e => setForm({ ...form, v_value4: e.target.value })}
          />

          <input
            type="number"
            placeholder="8 horas"
            className="p-2 border rounded"
            value={form.v_value8}
            onChange={e => setForm({ ...form, v_value8: e.target.value })}
          />

          <input
            type="number"
            placeholder="Hora extra"
            className="p-2 border rounded"
            value={form.v_value_extra}
            onChange={e => setForm({ ...form, v_value_extra: e.target.value })}
          />
        </div>

        <input
          type="text"
          placeholder="URLs de imágenes separadas por coma"
          className="w-full p-2 border rounded"
          value={form.v_url_img}
          onChange={e => setForm({ ...form, v_url_img: e.target.value })}
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.v_isPartner}
            onChange={e => setForm({ ...form, v_isPartner: e.target.checked })}
          />
          ¿Precio de Socios?
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700"
        >
          {loading ? "Guardando..." : "Crear espacio"}
        </button>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="w-full mt-2 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
          >
            Cancelar
          </button>
        )}
      </form>
    </div>
  );
}
