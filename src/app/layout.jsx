// src/app/layout.jsx
// Este es el layout raíz que envuelve todas las páginas.

import './globals.css'; // Asumimos que los estilos globales de Tailwind se importan aquí.
import { Geist } from 'next/font/google';


const geist = Geist({
  subsets: ['latin'],
})
// Configuración de la metadata para SEO
export const metadata = {
  title: 'Club del Meta | Agenda Espacios y Servicios para Eventos',
  description: 'Agendamiento de citas y reserva de espacios en los diferentes lugares de nuestro club.',
}

// Usamos la fuente Inter de Google Fonts (debes configurar el @font-face en globals.css)
// Para propósitos de este ejemplo, la tipografía será manejada por las clases de Tailwind.

export default function RootLayout({ children }) {
  // Aplicamos beigeClaro como fondo principal y azulOscuro como color de texto base
  return (
    <html lang="es">
      <head>
        {/*
          IMPORTACIÓN DE FUENTES: Importamos Anton y Inter desde Google Fonts.
          Nota: Necesitas definir las clases CSS para estas fuentes en globals.css
          o directamente usar clases arbitrarias si no puedes modificar el config de Tailwind.
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      {/*
        El React Compiler se activa automáticamente en tiempo de compilación
        en tu proyecto Next.js configurado. No requiere código especial aquí.
      */}
      <body className="font-sans antialiased bg-[rgb(235,224,209)] text-[rgb(25,50,90)]">
        <main className= "bg-white">
          {children}
        </main>
      </body>
    </html>
  )
}