// Refactor del componente siguiendo la organización acordada
// Mantiene TODA la lógica original de mapeos, rateInfo, extras y modales
// Solo reordena la UI y evita mostrar campos innecesarios

'use client';

import { useState, useEffect } from "react";
import { ArrowLeft, X } from "lucide-react";
import { getRates } from "@/lib/api/rates/rates";
import { getExtras } from "@/lib/api/extras/extras";
import { deleteReserva, updateReserva } from "@/lib/api/reservas/reservas";

export default function ReservaEnProsDetails({ reservaEnPros, onBack, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfirmFifthModal, setshowConfirmFifthModal] = useState(false);
  const [rates, setRates] = useState([]);
  const [extrasCatalog, setExtrasCatalog] = useState([]);

  useEffect(() => {
    async function loadCatalogs() {
      try {
        const r = await getRates();
        const e = await getExtras();
        setRates(r?.result ?? []);
        setExtrasCatalog(e?.result ?? []);
      } catch (err) {
        console.error("Error cargando catálogos", err);
      }
    }
    loadCatalogs();
  }, []);

  if (!reservaEnPros) {
    return <div className="text-gray-500 italic p-6">Selecciona una Solicitud de reserva para ver los detalles.</div>;
  }

  const rateInfo = rates.find(rt => rt.id_rate === reservaEnPros.fk_rate);

  const extrasMapped = reservaEnPros.extras?.map(ex => {
    const match = extrasCatalog.find(e => e.id_extra === ex.id_extra);
    return {
      ...ex,
      name: match?.name ?? `Extra #${ex.id_extra}`,
      catalog_value_add: match?.value_add ?? ex.value_add,
    };
  });

  const handleMarkAsFinalizado = async () => {
    if (!reservaEnPros) return;
    setLoading(true);

    try {
      const payload = {
        v_id_reservation: reservaEnPros.id_reservation || "",
        v_email: reservaEnPros.email,
        v_phone_number: reservaEnPros.phone_number,
        v_init_date: reservaEnPros.init_date,
        v_end_date: reservaEnPros.end_date,
        v_pax: reservaEnPros.pax,
        v_status: "FINALIZADO",
        v_extras: JSON.stringify(reservaEnPros.extras || []),
        v_amount: Number(reservaEnPros.amount) || 0,
        v_total_value: Number(reservaEnPros.total_value) || 0,
        v_fk_rate: reservaEnPros.fk_rate,
      };

      const res = await updateReserva(payload);

      if (res && res.message) {
        alert(res.message);
        onUpdate && onUpdate();
      } else {
        alert("Reserva actualizada, pero no se recibió mensaje del backend");
      }
    } catch (err) {
      console.error(err);
      alert("Error al actualizar la reserva");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await deleteReserva(reservaEnPros.id_reservation);
      setShowDeleteModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      onUpdate && onUpdate();
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 border rounded-xl p-6 bg-white shadow border-[rgb(210,190,160)]">

      {showConfirmFifthModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.34)] flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-80 space-y-4 border border-[rgb(210,190,160)]">
            <h2 className="text-xl font-bold text-gray-700">¿Finalizar reserva?</h2>
            <p className="text-gray-600">Confirma que el cliente pagó el 100%.</p>
            <p className="text-gray-600">Es irreversible.</p>
            <div className="flex justify-center gap-3 mt-5">
              <button onClick={() => setshowConfirmFifthModal(false)} className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100">Cancelar</button>
              <button onClick={handleMarkAsFinalizado} className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.34)] flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-80 space-y-4 border border-[rgb(210,190,160)]">
            <h2 className="text-xl font-bold text-gray-700">¿Eliminar Solicitud?</h2>
            <p className="text-gray-600">Esta acción no se puede deshacer.</p>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100">Cancelar</button>
              <button onClick={handleConfirmDelete} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">{loading ? "Eliminando..." : "Eliminar"}</button>
            </div>
          </div>
        </div>
      )}

      {onBack && (
        <button onClick={onBack} className="md:hidden mb-4 flex items-center gap-2 text-gray-700 hover:text-black">
          <ArrowLeft size={18} /> Volver
        </button>
      )}

      <h1 className="text-3xl font-bold text-gray-700">Reserva #{reservaEnPros.id_reservation}</h1>

      {/* CLIENTE */}
      <div className="p-4 bg-gray-50 rounded-lg border border-[rgb(210,190,160)]">
        <h3 className="font-bold text-lg text-gray-700 mb-2">Información del Cliente</h3>
        <p className="font-semibold">{reservaEnPros.name}</p>
        <p className="text-sm text-gray-500 mt-2">Correo: {reservaEnPros.email}</p>
        <p className="text-sm text-gray-500 mt-2">Teléfono: {reservaEnPros.phone_number}</p>
      </div>

      {/* TARIFA */}
      <div className="p-4 bg-gray-50 rounded-lg border border-[rgb(210,190,160)]">
        <h3 className="font-bold text-lg text-gray-700 mb-2">Información de Tarifa</h3>

        {rateInfo ? (
          <>
            <p><strong>Espacio:</strong> {rateInfo.espacio}</p>
            <p><strong>Tarifa:</strong> {rateInfo.tarifa}</p>
            <p className="mt-2 text-gray-700">Valor estimado: {reservaEnPros.estimated_value}</p>
            <p className="text-gray-700">Valor total real: {reservaEnPros.total_value}</p>
            <p className="text-gray-700">Abono entregado: {reservaEnPros.amount}</p>
          </>
        ) : (
          <p className="text-gray-500 italic">Cargando tarifa...</p>
        )}
      </div>

      {/* EVENTO */}
      <div className="p-4 bg-gray-50 rounded-lg border border-[rgb(210,190,160)]">
        <h3 className="font-bold text-lg text-gray-700 mb-2">Información del Evento</h3>
        <p><strong>Fecha inicio:</strong> {reservaEnPros.init_date}</p>
        <p><strong>Fecha fin:</strong> {reservaEnPros.end_date}</p>
        <p><strong>Número de personas (PAX):</strong> {reservaEnPros.pax}</p>
      </div>

      {/* EXTRAS */}
      <div className="p-4 bg-gray-50 rounded-lg border border-[rgb(210,190,160)]">
        <h3 className="font-bold text-lg text-gray-700 mb-3">Extras</h3>

        {extrasMapped && extrasMapped.length > 0 ? (
          <>
            {extrasMapped.map((extra, idx) => (
              <div key={idx} className="p-3 mb-2 rounded-lg bg-white border border-gray-200 shadow-sm">
                <p className="font-semibold text-gray-800">{extra.name}</p>
                <p className="text-gray-600 text-sm">Cantidad: {extra.quantity}</p>
                <p className="text-gray-600 text-sm">Valor catálogo: ${extra.catalog_value_add}</p>
                <p className="mt-1 font-semibold text-gray-900">Subtotal: ${extra.quantity * Number(extra.catalog_value_add)}</p>
              </div>
            ))}

            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-right font-semibold text-amber-700">
              Total extras: $
              {extrasMapped.reduce((sum, e) => sum + e.quantity * Number(e.catalog_value_add), 0)}
            </div>
          </>
        ) : (
          <p className="text-gray-500 italic">No se registraron extras.</p>
        )}
      </div>

      {/* DESCRIPCIÓN */}
      <div className="p-4 bg-gray-50 rounded-lg border border-[rgb(210,190,160)]">
        <h3 className="font-bold text-lg text-gray-700 mb-2">Descripción del Evento</h3>
        <p>{reservaEnPros.description || "Sin descripción"}</p>
      </div>

      {/* ACCIONES */}
      <div className="flex gap-4 justify-center mt-6">
        <button onClick={() => setshowConfirmFifthModal(true)} className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">
          Marcar como FINALIZADO
        </button>

        <button onClick={() => setShowDeleteModal(true)} className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center gap-2">
          <X size={18} />
          Rechazar / Eliminar
        </button>
      </div>
    </div>
  );
}