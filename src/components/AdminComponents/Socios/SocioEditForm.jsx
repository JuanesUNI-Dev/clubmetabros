// src/components/AdminComponents/SocioEditForm.jsx
'use client';

import { useState } from "react";
import { updatePartner } from "@/lib/api/partners/partners";

export default function SocioEditForm({ socio, onBack, onUpdate }) {

  const [form, setForm] = useState({
    name: socio.name || "",
    email: socio.email || "",
    phone_number: socio.phone_number || "",
    cedula: socio.cedula || "",
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
    const payload = {
      id: socio.id_partner,
      name: form.name,
      email: form.email,
      phoneNumber: form.phone_number,
      cedula: form.cedula,
    };

    const res = await updatePartner(payload);
    if (res.error) throw new Error(res.error);

    setMsg("✔ Socio actualizado correctamente");

    // ✔ Refresca lista
    onUpdate?.();

    // ✔ Cerrar después
    setTimeout(() => {
      onBack?.();
    }, 1200);

  } catch (err) {
    setMsg("❌ " + err.message);

  } finally {
    setLoading(false);
  }
}


  return (
    <div className="p-6 border rounded-xl bg-white shadow border-[rgb(210,190,160)]">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Editar Socio</h2>

      {msg && (
        <div className="p-2 mb-3 text-center rounded-xl bg-gray-100 border">
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Nombre */}
        <div>
          <label className="font-semibold">Nombre completo</label>
          <input
            type="text"
            name="name"
            className="w-full p-2 border rounded-lg mt-1"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="font-semibold">Correo electrónico</label>
          <input
            type="email"
            name="email"
            className="w-full p-2 border rounded-lg mt-1"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Teléfono */}
        <div>
          <label className="font-semibold">Teléfono</label>
          <input
            type="text"
            name="phone_number"
            className="w-full p-2 border rounded-lg mt-1"
            value={form.phone_number}
            onChange={handleChange}
            required
          />
        </div>

        {/* Cédula */}
        <div>
          <label className="font-semibold">Cédula</label>
          <input
            type="text"
            name="cedula"
            className="w-full p-2 border rounded-lg mt-1"
            value={form.cedula}
            onChange={handleChange}
            required
          />
        </div>

        {/* Botones */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700"
        >
          {loading ? "Guardando..." : "Actualizar Socio"}
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
