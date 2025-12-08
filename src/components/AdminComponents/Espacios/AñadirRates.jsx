// src/components/AdminComponents/AñadirTarifa.jsx
'use client';

import { useState } from "react";
import { createRate } from "@/lib/api/rates/rates";

export default function TarifaCreateForm({ onBack, onCreated, espacio }) {

    const [form, setForm] = useState({
    v_name: "",
    v_pax: "",
    v_value4: "",
    v_value8: "",
    v_value_extra: "",
    v_isPartner: espacio.is_partner,
    v_idSpace: espacio?.realSpaceId || "",

    });


  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const payload = {
      v_name: form.v_name,
      v_pax: Number(form.v_pax),
      v_value4: Number(form.v_value4),
      v_value8: Number(form.v_value8),
      v_value_extra: Number(form.v_value_extra),
      v_isPartner: form.v_isPartner,
      v_idSpace: Number(form.v_idSpace),
    };

    const res = await createRate(payload);
    console.log("Resultado creación tarifa:", res);

    if (res) {
      setMsg(res.message);
      if (onCreated) onCreated();
      if (onBack) setTimeout(() => onBack(), 2000);
    }

    setLoading(false);
  }


  return (
    <div className="p-6 border rounded-xl bg-white shadow border-[rgb(210,190,160)]">
      <h2 className="text-2xl font-bold mb-4">Crear nueva tarifa</h2>

      {msg && (
        <div className="p-2 mb-3 text-center rounded-xl bg-gray-100 border">
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Nombre */}
        <input
          type="text"
          placeholder="Nombre de la tarifa"
          className="w-full p-2 border rounded"
          value={form.v_name}
          onChange={(e) => setForm({ ...form, v_name: e.target.value })}
          required
        />

        {/* Pax */}
        <input
          type="number"
          placeholder="Capacidad (Pax)"
          className="w-full p-2 border rounded"
          value={form.v_pax}
          onChange={(e) => setForm({ ...form, v_pax: e.target.value })}
          required
        />

        {/* Valores */}
        <div className="grid grid-cols-3 gap-3">
          <input
            type="number"
            placeholder="4 horas"
            className="p-2 border rounded"
            value={form.v_value4}
            onChange={(e) => setForm({ ...form, v_value4: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="8 horas"
            className="p-2 border rounded"
            value={form.v_value8}
            onChange={(e) => setForm({ ...form, v_value8: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="Hora extra"
            className="p-2 border rounded"
            value={form.v_value_extra}
            onChange={(e) => setForm({ ...form, v_value_extra: e.target.value })}
            required
          />
        </div>

        {/* Botones */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700"
        >
          {loading ? "Guardando..." : "Crear tarifa"}
        </button>
        <button
            type="button"
            onClick={onBack}
            className="w-full mt-2 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300" 
        >
            Atras
          </button>
      </form>
    </div>
  );
}
