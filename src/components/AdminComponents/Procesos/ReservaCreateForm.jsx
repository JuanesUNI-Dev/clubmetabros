'use client';

import { useState, useEffect } from "react";
import { registerReserva } from "@/lib/api/reservas/reservas";
import { getExtras } from "@/lib/api/extras/extras";
import { getRates } from "@/lib/api/rates/rates";

export default function ReservaCreateForm({ reserva, onBack, onCreated }) {

  const [form, setForm] = useState({
    v_id_reservation: "",
    v_name: reserva.name || "",
    v_email: reserva.email || "",
    v_phone_number: reserva.phone_number || "",
    v_init_date: reserva.init_date || "",
    v_end_date: reserva.end_date || "",
    v_pax: reserva.pax || "",
    v_amount: "",
    v_total_value: "",
  });

  const [extrasList, setExtrasList] = useState([]);
  const [extrasOptions, setExtrasOptions] = useState([]);
  const [selectedExtra, setSelectedExtra] = useState("");
  const [extraQty, setExtraQty] = useState(1);

  const [rates, setRates] = useState([]);
  const [selectedRateId, setSelectedRateId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // Generar ID automáticamente
  useEffect(() => {
    if (!form.v_id_reservation) {
      const autoID = `RES-${Date.now().toString().slice(-6)}`;
      setForm(prev => ({ ...prev, v_id_reservation: autoID }));
    }
  }, []);

  // Cargar extras desde backend
  useEffect(() => {
    async function fetchExtras() {
      const res = await getExtras();
      if (res?.result) setExtrasOptions(res.result);
    }
    fetchExtras();
  }, []);

  // Cargar rates
  useEffect(() => {
    async function fetchRates() {
      const res = await getRates();
      if (res?.result) setRates(res.result);
    }
    fetchRates();
  }, []);

  // Elegir rate automático
  useEffect(() => {
    if (rates.length === 0) return;

    const found = rates.find(r =>
      r.espacio === reserva.espacio &&
      r.tarifa === reserva.tarifa &&
      r.is_partner === reserva.is_partner
    );

    if (found) {
      setSelectedRateId(found.id_rate);
      console.log("Rate encontrado:", found);
    }
  }, [rates]);

  // Agregar un extra existente
  function handleAddExtra() {
    if (!selectedExtra) return;

    const found = extrasOptions.find(e => e.id_extra == selectedExtra);
    if (!found) return;

    const extra = {
      id_extra: found.id_extra,
      name: found.name,
      value_add: Number(found.value_add),
      quantity: found.quantity,
      used_quantity: Number(extraQty),
    };

    setExtrasList(prev => [...prev, extra]);
    setSelectedExtra("");
    setExtraQty(1);
  }

  // Enviar la reserva
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const payload = {
      ...form,
      v_pax: Number(form.v_pax),
      v_amount: Number(form.v_amount),
      v_status: "EN PROGRESO",
      v_fk_rate: Number(selectedRateId),
      v_extras: JSON.stringify(
        extrasList.map(e => ({
          id_extra: e.id_extra,
          quantity: e.used_quantity,
          value_add: e.value_add
        }))
      ),
      v_total_value: Number(form.v_total_value),
    };

    const res = await registerReserva(payload);

    const success =
      res?.ok === true ||
      res?.success === true ||
      res?.status === 200 ||
      res?.message?.includes("Exitoso") ||
      res?.message?.includes("creada");

    if (!success) {
      setMsg(res?.message || "Error al crear la reserva");
      setLoading(false);
      return;
    }

    setMsg(res.message || "Reserva creada correctamente");

    if (onCreated) onCreated();
    if (onBack) setTimeout(() => onBack(), 600);

    setLoading(false);
  }

  return (
    <div className="p-6 border rounded-xl bg-white shadow border-[rgb(210,190,160)]">
      <h2 className="text-2xl font-bold mb-4">Crear nueva reserva</h2>

      {msg && (
        <div className="p-2 mb-3 text-center bg-gray-100 border rounded-xl">
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* ID */}
        <p className="font-semibold">ID GENERADA:</p>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={form.v_id_reservation}
          onChange={(e) => setForm({ ...form, v_id_reservation: e.target.value })}
        />

        {/* Datos personales */}
        <p className="font-semibold">Nombre:</p>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={form.v_name}
          onChange={(e) => setForm({ ...form, v_name: e.target.value })}
          required
        />

        <p className="font-semibold">Email:</p>
        <input
          type="email"
          className="w-full p-2 border rounded"
          value={form.v_email}
          onChange={(e) => setForm({ ...form, v_email: e.target.value })}
          required
        />

        <p className="font-semibold">Número de celular:</p>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={form.v_phone_number}
          onChange={(e) => setForm({ ...form, v_phone_number: e.target.value })}
          required
        />

        {/* Fechas */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="font-semibold">Fecha de inicio:</p>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={form.v_init_date}
              onChange={(e) => setForm({ ...form, v_init_date: e.target.value })}
              required
            />
          </div>

          <div>
            <p className="font-semibold">Fecha final:</p>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={form.v_end_date}
              onChange={(e) => setForm({ ...form, v_end_date: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Valores */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="font-semibold">Valor aproximado:</p>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={reserva.value_aprox}
              readOnly
            />
          </div>

          <div>
            <p className="font-semibold">Valor total:</p>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={form.v_total_value}
              onChange={(e) => setForm({ ...form, v_total_value: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Pax + Abono */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="font-semibold">Personas:</p>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={form.v_pax}
              onChange={(e) => setForm({ ...form, v_pax: e.target.value })}
              required
            />
          </div>

          <div>
            <p className="font-semibold">Abono:</p>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={form.v_amount}
              onChange={(e) => setForm({ ...form, v_amount: e.target.value })}
            />
          </div>
        </div>

        {/* Extras */}
        <div className="border rounded-xl p-4 bg-gray-50">
          <h3 className="font-semibold mb-2">Extras</h3>

          <select
            className="w-full p-2 border rounded"
            value={selectedExtra}
            onChange={(e) => setSelectedExtra(e.target.value)}
          >
            <option value="">Seleccionar extra...</option>
            {extrasOptions.map(ex => (
              <option key={ex.id_extra} value={ex.id_extra}>
                {ex.name} — ${ex.value_add}
              </option>
            ))}
          </select>

          <input
            type="number"
            className="w-full p-2 border rounded mt-3"
            placeholder="Cantidad a usar"
            value={extraQty}
            onChange={(e) => setExtraQty(e.target.value)}
          />

          <button
            type="button"
            className="w-full mt-2 py-2 bg-gray-300 rounded-xl hover:bg-gray-400"
            onClick={handleAddExtra}
          >
            Agregar extra
          </button>

          {extrasList.length > 0 && (
            <div className="mt-4">
              {extrasList.map((e, idx) => (
                <div
                  key={idx}
                  className="flex justify-between p-2 bg-white border rounded mb-1"
                >
                  <span>
                    {e.name} × {e.used_quantity}
                  </span>

                  <button
                    className="text-red-600 font-bold"
                    onClick={() =>
                      setExtrasList(prev => prev.filter((_, i) => i !== idx))
                    }
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botón principal */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700"
        >
          {loading ? "Guardando..." : "Crear reserva"}
        </button>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="w-full mt-2 py-2 bg-gray-200 rounded-xl hover:bg-gray-300"
          >
            Cancelar
          </button>
        )}
      </form>
    </div>
  );
}
