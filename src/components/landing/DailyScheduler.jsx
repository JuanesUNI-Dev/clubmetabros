// src/components/landing/DailyScheduler.jsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { getOccupiedSpaces } from "@/lib/api/spaces/spaces";

export default function DailyScheduler({ spacename, onSelect = () => {} }) {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDay, setSelectedDay] = useState(dayjs());
  const [startHour, setStartHour] = useState(null);
  const [endHour, setEndHour] = useState(null);
  const [step, setStep] = useState(1);
  const [occupied, setOccupied] = useState([]); // horas ocupadas

  const hours = Array.from({ length: 18 }, (_, i) =>
    `${(6 + i).toString().padStart(2, "0")}:00`
  );

  // ============================
  // CARGAR HORAS OCUPADAS DEL DÍA
  // ============================
  useEffect(() => {
    async function loadOccupied() {
      const data = await getOccupiedSpaces(spacename);
      if (!data || !data.result) {
        setOccupied([]);
        return;
      }

      const day = selectedDay.format("YYYY-MM-DD");

      const todays = data.result.filter(
        (r) => dayjs(r.init_date).format("YYYY-MM-DD") === day
      );

      const blocked = [];

      todays.forEach((res) => {
        let current = dayjs(res.init_date);
        const end = dayjs(res.end_date);

        while (current <= end) {
          blocked.push(current.format("HH:00"));
          current = current.add(1, "hour");
        }
      });

      setOccupied(blocked);
    }

    loadOccupied();
  }, [selectedDay]);

  const handleHourClick = (hour) => {
    if (occupied.includes(hour)) return; // bloqueada

    if (!startHour) {
      setStartHour(hour);
      return;
    }

    let first = startHour;
    let second = hour;
    if (hours.indexOf(second) < hours.indexOf(first)) {
      [first, second] = [second, first];
    }

    setStartHour(first);
    setEndHour(second);

    onSelect({
      date: selectedDay.format("YYYY-MM-DD"),
      start: first,
      end: second,
    });
  };

  const weekdays = [
    { label: "D", key: "dom" },
    { label: "L", key: "lun" },
    { label: "M", key: "mar" },
    { label: "M", key: "mie" },
    { label: "J", key: "jue" },
    { label: "V", key: "vie" },
    { label: "S", key: "sab" },
  ];

  const getDaysInMonth = () => {
    const start = currentMonth.startOf("month").day();
    const total = currentMonth.daysInMonth();
    const days = [];
    for (let i = 0; i < start; i++) days.push(null);
    for (let d = 1; d <= total; d++) days.push(dayjs(currentMonth).date(d));
    return days;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full max-h-[70vh] overflow-y-auto">
      
      {/* CALENDARIO */}
      <div className="w-full lg:w-56 bg-neutral-900 rounded-xl p-2 border border-neutral-800">
        
        {/* Navegación mes */}
        <div className="flex justify-between items-center text-white mb-2 text-sm">
          <button
            onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}
            className="text-neutral-400 hover:text-white"
          >←</button>

          <span className="font-medium text-sm">
            {currentMonth.format("MMM YYYY")}
          </span>

          <button
            onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}
            className="text-neutral-400 hover:text-white"
          >→</button>
        </div>

        <div className="grid grid-cols-7 text-center text-neutral-500 text-[9px] mb-1">
          {weekdays.map((d) => (
            <div key={d.key}>{d.label}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 overflow-x-auto">
          {getDaysInMonth().map((day, i) =>
            day ? (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1 }}
                className={`cursor-pointer p-1.5 rounded-lg text-center text-[10px] ${
                  selectedDay.isSame(day, "day")
                    ? "bg-blue-600 text-white"
                    : "text-neutral-300 hover:bg-neutral-800"
                }`}
                onClick={() => {
                  setSelectedDay(day);
                  if (window.innerWidth < 1024) setStep(2);
                }}
              >
                {day.date()}
              </motion.div>
            ) : (
              <div key={i} />
            )
          )}
        </div>
      </div>

      {/* LISTA DE HORAS */}
      {(step === 2 || window.innerWidth >= 1024) && (
        <div className="flex-1 bg-neutral-900 rounded-xl p-2 border border-neutral-800 h-[250px] overflow-y-auto">
          
          {/* Navegación día */}
          <div className="flex justify-between text-white mb-2 text-sm">
            <button
              onClick={() => setSelectedDay(selectedDay.subtract(1, "day"))}
              className="text-neutral-400 hover:text-white"
            >←</button>

            <span className="font-medium">{selectedDay.format("DD MMM")}</span>

            <button
              onClick={() => setSelectedDay(selectedDay.add(1, "day"))}
              className="text-neutral-400 hover:text-white"
            >→</button>
          </div>

          {hours.map((hour) => {
            const isOccupied = occupied.includes(hour);

            return (
              <motion.div
                key={hour}
                whileHover={{ scale: isOccupied ? 1 : 1.02 }}
                onClick={() => !isOccupied && handleHourClick(hour)}
                className={`flex items-center px-2 h-8 mb-1 rounded-lg text-sm border border-neutral-800 
                  ${
                    isOccupied
                      ? "bg-red-900/40 text-red-300 cursor-not-allowed"
                      : startHour === hour || endHour === hour
                      ? "bg-blue-800/40 text-blue-300 cursor-pointer"
                      : "hover:bg-neutral-800 text-neutral-300 cursor-pointer"
                  }
                `}
              >
                {hour}
              </motion.div>
            );
          })}

          {/* Botón volver móvil */}
          {window.innerWidth < 1024 && (
            <button
              onClick={() => setStep(1)}
              className="mt-2 w-full py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Atrás
            </button>
          )}
        </div>
      )}
    </div>
  );
}
