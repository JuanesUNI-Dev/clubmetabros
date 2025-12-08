'use client';

import { ArrowLeft, Trash2, Pencil } from "lucide-react";
import { useState } from "react";
import ExtraEditForm from "@/components/AdminComponents/Extras/ExtrasEditForm";

import { deleteExtra } from "@/lib/api/extras/extras.js";

export default function ExtrasDetails({ extra, onBack }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  if (!extra) {
    return (
      <div className="text-gray-500 italic p-6">
        Selecciona un extra para ver los detalles.
      </div>
    );
  }

  return (
    <div className="space-y-6 border rounded-xl p-6 bg-white shadow border-[rgb(210,190,160)]">

      {/* Botón volver (mobile) */}
      {onBack && (
        <button
          onClick={onBack}
          className="md:hidden mb-4 flex items-center gap-2 text-gray-700 hover:text-black"
        >
          <ArrowLeft size={18} />
          Volver
        </button>
      )}

      {/* Título */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-gray-700">{extra.name}</h1>

        <div className="lg:flex gap-2 sm:scale-80">
          <button
            onClick={() => setShowUpdateForm(true)}
            className="px-4 py-2 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 flex gap-2 sm:mb-2"
          >
            <Pencil size={18} />
            Actualizar
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-700 text-white rounded-xl flex items-center gap-2 hover:bg-red-800 cursor-pointer"
          >
            <Trash2 size={18} />
            Eliminar
          </button>
        </div>
      </div>

      {/* 🚀 FORMULARIO DE UPDATE (FULL WIDTH) */}
      {showUpdateForm && (
        <div className="mt-4">
          <ExtraEditForm
            extra={extra}
            onBack={() => setShowUpdateForm(false)}
          />
        </div>
      )}

      {/* Mostrar detalles SOLO si no está editando */}
      {!showUpdateForm && (
        <div className="grid md:grid-cols-1 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-[rgb(210,190,160)]">
            <h3 className="font-bold text-lg text-gray-700 mb-2 mt-1.5">
              Información del extra
            </h3>

            <p><b>ID:</b> {extra.id_extra}</p>
            <p><b>Nombre:</b> {extra.name}</p>
            <p><b>Valor adicional:</b> ${extra.value_add}</p>
            <p><b>Cantidad disponible:</b> {extra.quantity}</p>
          </div>
        </div>
      )}

      {/* ❌ MODAL ELIMINAR */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-[rgb(0,0,0,0.5)] flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">
              Confirmar eliminación
            </h2>
            <p className="text-gray-600 mb-6">
              ¿Seguro que deseas eliminar este extra?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-1.5 rounded-xl border bg-gray-100 hover:bg-gray-200 cursor-pointer"
              >
                Cancelar
              </button>

              <button
                onClick={async () => {
                  await deleteExtra(extra.id_extra);
                  setShowDeleteModal(false);
                  onBack?.();
                }}
                className="px-3 py-1.5 rounded-xl bg-red-700 text-white hover:bg-red-800 cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
