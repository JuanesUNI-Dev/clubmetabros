// src/components/AdminComponents/AñadirSocioForm.jsx
'use client';

import { useState } from "react";
import { registerPartner } from "@/lib/api/partners/partners.js";

export default function SocioCreateForm({ onCancel, onSuccess, onBack, onUpdate }) {
  const [form, setForm] = useState({
    id: "",
    name: "",
    email: "",
    phoneNumber: "",
    cedula: "",
  });

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);

  const payload = {
    ...form,
    phoneNumber: String(form.phoneNumber),
    cedula: Number(form.cedula),
  };

  try {
    const res = await registerPartner(payload);
    console.log("Resultado creación socio:", res);

    // ✔ Refresca la lista


    // ✔ Luego salimos del formulario
    onSuccess?.();
    onBack?.();

  } finally {
    onUpdate && onUpdate();
    setLoading(false);
  }
}


  return (
    <div className="p-6 border rounded-xl bg-white shadow border-[rgb(210,190,160)]">
        
      <h2 className="text-2xl font-bold mb-4">Registrar nuevo socio</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        <input
          type="text"
          placeholder="Código del socio (ID)"
          className="w-full p-2 border rounded"
          value={form.id}
          onChange={(e) => setForm({ ...form, id: e.target.value })}
        />

        <input
          type="text"
          placeholder="Nombre completo"
          className="w-full p-2 border rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          placeholder="Correo"
          className="w-full p-2 border rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="number"
          placeholder="Teléfono"
          className="w-full p-2 border rounded"
          value={form.phoneNumber}
          onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
        />

        <input
          type="number"
          placeholder="Cédula"
          className="w-full p-2 border rounded"
          value={form.cedula}
          onChange={(e) => setForm({ ...form, cedula: e.target.value })}
        />

        {/* Botón guardar */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700"
        >
          {loading ? "Guardando..." : "Registrar socio"}
        </button>

        {/* Botón cancelar */}

          <button
            type="button"
            onClick={onCancel}
            className="w-full mt-2 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
          >
            Cancelar
          </button>

      </form>
    </div>
  );
}
