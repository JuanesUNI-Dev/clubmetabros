# Corporación Club El Meta

Proyecto web desarrollado para la **Corporación Club El Meta**, con el objetivo de facilitar la reserva de espacios dentro de las instalaciones del club y ofrecer una plataforma administrativa para la gestión interna.  

Este sistema cuenta con un **Landing Page** orientado al público general y un **panel administrativo** para empleados autorizados.

---

## 🚀 Funcionalidades principales

### 🏠 Landing Page (Público)
- Visualización de los espacios disponibles del club.
- Proceso de solicitud de reserva.
- Cotización automática basada en:
  - Tiempo de alquiler.
  - Espacio seleccionado.
  - Organización de mesas.
- Envío de solicitud de reserva para revisión del administrador (pendiente de aprobación o rechazo).

### 🔐 Panel Administrativo
- **CRUD de espacios** (crear, editar, eliminar, activar/inactivar).
- **CRUD de empleados** con roles según permisos.
- **Gestión de solicitudes de reserva**, con opciones para:
  - Aceptar o rechazar solicitudes.
  - Ver historial.
- Gestión adicional en progreso:
  - Reportes.
  - Administración de tarifas.
  - Configuración interna del sistema.

---

## 🛠️ Tecnologías utilizadas

- **Next.js** – Framework principal del proyecto.  
- **Tailwind CSS** – Framework CSS para estilos rápidos y responsive.  
- (Opcional: agrega aquí Prisma, TypeScript, PostgreSQL, Auth, si los estás usando)

---

## 📂 Estructura general del proyecto (resumen)

```bash
demet-frontend
├── README.md
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── logos
│   │   └── IMAGENES
│   ├── next.svg
│   ├── salones
│   │   └── IMAGENES
│   ├── vercel.svg
│   └── window.svg
└── src
    ├── app
    │   ├── admin
    │   │   ├── layout.jsx
    │   │   └── page.jsx
    │   ├── agendamiento
    │   │   └── page.jsx
    │   ├── api
    │   │   └── page.jsx
    │   ├── favicon.ico
    │   ├── globals.css
    │   ├── layout.jsx
    │   ├── login
    │   │   └── page.jsx
    │   └── page.jsx
    ├── components
    │   ├── LoginComponents
    │   │   ├── Login.jsx
    │   │   ├── Login2.jsx
    │   │   ├── LoginWrapper.jsx
    │   │   └── indexLogin.jsx
    │   ├── index.jsx
    │   └── landing
    │       ├── ComponentesUI.jsx
    │       ├── DailyCalendar.jsx
    │       ├── DailyScheduler.jsx
    │       ├── ImageCarousel.jsx
    │       ├── ReservationModal.jsx
    │       ├── SpaceDetailsModals.jsx
    │       ├── SpaceGridCard.jsx
    │       ├── Ubication.jsx
    │       ├── VenueCard.jsx
    │       └── ZoomModal.jsx
    ├── data
    │   └── api-mock
    │       ├── api-mock.json
    │       └── api-mock2.json
    └── middleware
        └── proxy.js
```

🗺️ Estado del proyecto
✔️ Completado

Landing Page funcional.

🔧 En progreso

Lógica de cotización automática.

CRUD básico de espacios y empleados.

Flujo de solicitudes de reserva.

Mejoras de UI/UX.

Automatización de reportes.

Funcionalidades extendidas para tarifas.

Sección administrativa avanzada.

