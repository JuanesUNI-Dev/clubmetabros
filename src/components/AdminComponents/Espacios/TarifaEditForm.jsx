"use client";

import React, { useState } from "react";
import { updateRate } from "@/lib/api/rates/rates"; // ⬅️ ahora sí usas el update correcto
import { XCircle, Save } from "lucide-react";

export default function TarifaEditForm({ rate, onCancel, onUpdated }) {


  const [form, setForm] = useState({
    v_id_rate: rate.id_rate,
    v_name: rate.tarifa,
    v_pax: rate.pax,
    v_value4: rate.value_4_hours,
    v_value8: rate.value_8_hours,
    v_value_extra: rate.value_extra_hour,
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      // 🔥 SOLO LO QUE EL BACKEND REQUIERE
      const payload = {
        v_id_rate: Number(form.v_id_rate),
        v_name: form.v_name,
        v_pax: Number(form.v_pax),
        v_value4: Number(form.v_value4),
        v_value8: Number(form.v_value8),
        v_value_extra: Number(form.v_value_extra),
      };

      const data = await updateRate(payload);

      if (data.error) throw new Error(data.error);

      setMsg("✔ Tarifa actualizada exitosamente");
      
      if (onUpdated) onUpdated();
    } catch (err) {
      setMsg("❌ " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="border rounded-xl p-6 bg-white shadow-md mt-4">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">
        Editar Tarifa #{rate.id_rate}
      </h2>

      {msg && (
        <div className="p-3 mb-3 text-center rounded-lg bg-gray-50 border">
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="font-semibold">Nombre Tarifa</label>
          <input
            type="text"
            name="v_name"
            value={form.v_name}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="font-semibold">Capacidad (Pax)</label>
          <input
            type="number"
            name="v_pax"
            value={form.v_pax}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div>
            <label className="font-semibold">4 Horas</label>
            <input
              type="number"
              name="v_value4"
              value={form.v_value4}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="font-semibold">8 Horas</label>
            <input
              type="number"
              name="v_value8"
              value={form.v_value8}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="font-semibold">Hora Extra</label>
            <input
              type="number"
              name="v_value_extra"
              value={form.v_value_extra}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

        </div>

        <div className="flex justify-end gap-3 mt-4">
          
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-red-500 text-white rounded-xl flex items-center gap-2 hover:bg-red-600"
          >
            <XCircle size={18} />
            Atras
          </button>

          <button
            type="submit"
            disabled={loading}
            
            className="px-4 py-2 bg-green-600 text-white rounded-xl flex items-center gap-2 hover:bg-green-700"
          >
            <Save size={18} />
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>

        </div>
      </form>
    </div>
  );
}
