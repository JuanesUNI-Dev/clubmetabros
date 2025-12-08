'use client';

import { useState } from "react";
import { postRegister } from "@/lib/api/Auth/users";

export default function EmpleadoForm({ onCancel, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    rol: "Administrador",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const response = await postRegister(form);

    setLoading(false);

    if (response?.ok) {
      setMsg("Empleado registrado correctamente.");
      onSuccess(); // refrescar la lista / cerrar
    } else {
      setMsg(response?.data?.message || "Error al registrar.");
    }
  }

  return (
    <div className="w-full p-6 bg-white rounded-xl border shadow">
      <h2 className="text-xl font-semibold mb-4">Registrar Empleado</h2>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Nombre completo"
          value={form.name}
          onChange={handleChange}
          required
          className="p-2 border rounded-lg"
        />

        <input
          name="email"
          type="email"
          placeholder="Correo"
          value={form.email}
          onChange={handleChange}
          required
          className="p-2 border rounded-lg"
        />

        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
          className="p-2 border rounded-lg"
        />

        <select
          name="rol"
          value={form.rol}
          onChange={handleChange}
          className="p-2 border rounded-lg"
        >
          <option value="Administrador">Administrador</option>
          <option value="Asistente de Gerencia">Asistente de Gerencia</option>
        </select>

        {msg && (
          <p className="text-center text-sm text-gray-600">{msg}</p>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
          >
            {loading ? "Registrando..." : "Registrar"}
          </button>
        </div>
      </form>
    </div>
  );
}
