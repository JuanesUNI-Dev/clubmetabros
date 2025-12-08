"use client";

import { exportReport } from "@/lib/api/reports/reports";

export default function ReportesPage() {
  const handleDownload = async () => {
    const res = await exportReport();

    if (!res.success) {
      alert(res.message);
      return;
    }

    // Crear URL temporal
    const url = window.URL.createObjectURL(res.file);

    const link = document.createElement("a");
    link.href = url;
    link.download = "Reportes.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 border rounded-xl bg-white shadow space-y-4">
      <h2 className="text-2xl font-bold">Generar Reportes</h2>

      <p className="text-gray-600">
        Descarga el archivo Excel que contiene los reportes generados desde el sistema.
      </p>

      <button
        onClick={handleDownload}
        className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-xl"
      >
        Descargar Reportes
      </button>
    </div>
  );
}
