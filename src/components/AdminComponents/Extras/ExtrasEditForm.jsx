// src/components/AdminComponents/ExtrasEditForm.jsx
"use client";

import React, { useState } from "react";
import { updateExtra } from "@/lib/api/extras/extras";
import { Loader2, ArrowLeft } from "lucide-react";

export default function ExtraEditForm({ extra, onBack, onSuccess }) {
  const [formData, setFormData] = useState({
    v_name: extra.name || "",
    v_value_add: extra.value_add || "",
    v_quantity: extra.quantity || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      v_id_extra: extra.id_extra,
      v_name: formData.v_name,
      v_value_add: Number(formData.v_value_add),
      v_quantity: Number(formData.v_quantity),
    };

    const res = await updateExtra(payload);
    setLoading(false);

    if (res?.success) {
      onSuccess?.(); // por si luego quieres refrescar
      onBack();      // vuelve a los detalles
    } else {
      alert(res?.message || "Error actualizando el extra");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border rounded-xl bg-gray-50"
    >
      {/* Botón volver */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-gray-700 hover:text-black mb-2"
      >
        <ArrowLeft size={18} />
        Volver
      </button>

      <div>
        <label className="block text-sm font-medium">Nombre</label>
        <input
          type="text"
          name="v_name"
          value={formData.v_name}
          onChange={handleChange}
          required
          className="w-full p-2 rounded border bg-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Valor adicional</label>
        <input
          type="number"
          name="v_value_add"
          value={formData.v_value_add}
          onChange={handleChange}
          required
          className="w-full p-2 rounded border bg-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Cantidad</label>
        <input
          type="number"
          name="v_quantity"
          value={formData.v_quantity}
          onChange={handleChange}
          required
          className="w-full p-2 rounded border bg-white"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 p-2 rounded-2xl text-white"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        Guardar Cambios
      </button>

      <button
        type="button"
        onClick={onBack}
        className="w-full flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 p-2 rounded-2xl text-white"
      >
        Cancelar
      </button>
    </form>
  );
}
