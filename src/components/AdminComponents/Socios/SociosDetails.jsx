'use client';

import { ArrowLeft, Trash2, Pencil } from "lucide-react";
import { useState } from "react";
import { deletePartner } from "@/lib/api/partners/partners";
import SocioEditForm from "@/components/AdminComponents/Socios/SocioEditForm";

export default function SociosDetalles({ socio, onBack, onUpdate }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  // Manejar eliminación
  const handleDelete = async () => {
    try {
      await deletePartner(
        socio.id_partner,
        socio.email
      );

      setShowDeleteModal(false);
      onUpdate && onUpdate();

      // Regresar a la lista
      if (onBack) onBack();
    } catch (error) {
      console.error("Error eliminando socio:", error);
    }
  };

  if (!socio) {
    return (
      <div className="text-gray-500 italic p-6">
        Selecciona un socio para ver los detalles.
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
        <h1 className="text-3xl font-bold text-gray-700">{socio.name}</h1>

        <div className="gap-2 sm:scale-80">
          <button
            onClick={() => setShowUpdateForm(true)}
            className="px-4 py-2 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 flex gap-2 sm:mb-2 "
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

      {/* 🚀 Modal eliminar */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-[90%] max-w-md border border-[rgb(210,190,160)]">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              ¿Eliminar socio?
            </h2>
            <p className="text-gray-600 mb-6">
              Esta acción no se puede deshacer. ¿Estás seguro de eliminar a <b>{socio.name}</b>?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-700 text-white rounded-xl hover:bg-red-800"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🚀 FORMULARIO DE UPDATE */}
      {showUpdateForm && (
        <div className="mt-4">
          <SocioEditForm
            socio={socio}
            onBack={() => setShowUpdateForm(false)}
          />
        </div>
      )}

      {/* SOLO si NO está el form */}
      {!showUpdateForm && (
        <div className="grid md:grid-cols-1 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-[rgb(210,190,160)]">
            <h3 className="font-bold text-lg text-gray-700 mb-2 mt-1.5">
              Información del socio
            </h3>

            <p><b>ID:</b> {socio.id_partner}</p>
            <p><b>Nombre:</b> {socio.name}</p>
            <p><b>Email:</b> {socio.email}</p>
            <p><b>Teléfono:</b> {socio.phone_number}</p>
            <p><b>Cédula:</b> {socio.cedula}</p>
          </div>
        </div>
      )}
    </div>
  );
}
