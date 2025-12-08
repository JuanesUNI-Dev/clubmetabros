// src/components/LoginComponents/Login.jsx
"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";

export default function Login({ isRegister, toggleMode }) {
  const router = useRouter();

  return (
    <div className="leftPanel">
      <h1>CLUB EL META</h1>
      <p>Nos alegra tenerte de vuelta</p>
      <p>
        Ingresa tus datos e inicia tu experiencia con el mejor club en todo el Meta!
      </p>

      <button className="toggleBtn" onClick={toggleMode}>
        {isRegister ? "Ya tengo cuenta" : "No tengo cuenta"}
      </button>

      <button onClick={() => router.push("/")} className="backBtn">Volver</button>
    </div>
  );
}
