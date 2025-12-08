// src/components/AdminComponents/Wrapper4060.jsx (AJUSTADO)
// Este componente de distribución es Client o Server, no requiere 'use client' si no usa hooks.

export default function Wrapper4060({ children, leftPanel }) { // <-- Recibe dos props
    return (
      <div className="flex w-full h-full gap-4"> 
        
        {/* PANEL IZQUIERDO (40%) - Renderiza el componente 'leftPanel' */}
        <section className="w-[40%] h-full border-4 border-[rgb(210,190,160)] rounded-xl p-4 shadow-sm overflow-y-auto">
          {/* Si leftPanel fue pasado, lo renderiza. Si no, usa el placeholder original. */}
          {leftPanel || (
            <>
              <div className="text-gray-700 font-semibold mb-2">Panel 40%</div>
              <div className="text-sm text-gray-600">Contenido o herramientas secundarias aquí.</div>
            </>
          )}
        </section>

        {/* PANEL DERECHO (60%) - Renderiza el contenido de 'children' */}
        <section className="w-[60%] h-full border-4 border-[rgb(210,190,160)] rounded-xl p-4 shadow-sm overflow-y-auto">
          
          {children} {/* <-- Contenido del 60% */}
        </section>
      </div>
    );
}