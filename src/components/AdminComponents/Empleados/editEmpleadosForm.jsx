// src/components/AdminComponents/InternEditForm.jsx
'use client';

import { useState } from "react";
import { updateIntern } from "@/lib/api/Auth/users";

export default function InternEditForm({ intern, onBack, onUpdate }) {

  const [form, setForm] = useState({
    name: intern.name || "",
    email: intern.email || "",
    rol: intern.rol || "Asistente de Gerencia", // valor por defecto
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
        v_idEmployee: Number(intern.id_employee),
        v_email: form.email,
        v_rol: form.rol,
      };

      const res = await updateIntern(payload);
      if (!res.ok) throw new Error(res.data.message || "Error desconocido");

      setMsg("✔ Empleado actualizado correctamente");

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
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Editar Empleado</h2>

      {msg && (
        <div className="p-2 mb-3 text-center rounded-xl bg-gray-100 border">
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

zx

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

        {/* Rol */}
        <div>
          <label className="font-semibold">Rol</label>
          <select
            name="rol"
            className="w-full p-2 border rounded-lg mt-1"
            value={form.rol}
            onChange={handleChange}
            required
          >
            <option value="Administrador">Administrador</option>
            <option value="Asistente de Gerencia">Asistente de Gerencia</option>
          </select>
        </div>

        {/* Botones */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700"
        >
          {loading ? "Guardando..." : "Actualizar Empleado"}
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
