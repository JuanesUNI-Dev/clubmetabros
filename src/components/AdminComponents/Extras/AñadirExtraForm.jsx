"use client";
import React, { useState } from "react";
import { registerExtra } from "@/lib/api/extras/extras"; 
import { Loader2 } from "lucide-react";

export default function ExtraCreateForm({ onUpdate ,onCancel, onSuccess }) {
  const [formData, setFormData] = useState({
    v_name: "",
    v_value_add: "",
    v_quantity: "",
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
      v_name: formData.v_name,
      v_value_add: Number(formData.v_value_add),
      v_quantity: Number(formData.v_quantity),
    };

    const res = await registerExtra(payload);
    setLoading(false);

    if (res?.success) {
      onSuccess();
      onCancel();
      onUpdate && onUpdate();
    } else {
      alert(res?.message || "Error registrando el extra");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-2">
      <div>
        <label className="block text-sm font-medium">Nombre del Extra</label>
        <input
          type="text"
          name="v_name"
          value={formData.v_name}
          onChange={handleChange}
          required
          className="w-full p-2 rounded border bg-white-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Precio Adicional</label>
        <input
          type="number"
          name="v_value_add"
          value={formData.v_value_add}
          onChange={handleChange}
          required
          className="w-full p-2 rounded border bg-white-900"
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
          className="w-full p-2 rounded border bg-white-900"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 p-2 rounded-2xl"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        Crear Extra
      </button>
      <button
          type="button"
          onClick={onCancel}
          className="w-full flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 p-2 rounded-2xl"
        >
          Cancelar
       </button>
    </form>
  );
}
