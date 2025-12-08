// src/components/LoginComponents/LoginFormRegistro.jsx
"use client";

import { useState } from "react";
import { postRegister } from "@/lib/api/Auth/users";

export default function RegisterForm({ toggleMode }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    role: "Asistente de Gerencia"   // 🔥 Rol fijo desde el estado
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    // Limpiar error cuando el usuario edita cualquier campo
    if (error) setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    // limpiar error previo antes de validar
    if (error) setError("");

    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        rol: "Asistente de Gerencia"
    };

    const { ok, data } = await postRegister(payload);

    if (!ok) {
        setError(data.message);
        return;
    }

    toggleMode();
    };

  return (
    <form onSubmit={submit}>
      <h2>Nombre:</h2>
      <input 
        name="name"
        type="text"
        placeholder="Juan Pérez"
        value={form.name}
        onChange={handleChange}
        required
      />

      <h2>Correo:</h2>
      <input 
        name="email"
        type="email"
        placeholder="correo@ejemplo.com"
        value={form.email}
        onChange={handleChange}
        required
      />

      <h2>Contraseña:</h2>
      <input 
        name="password"
        type="password"
        placeholder="********"
        value={form.password}
        onChange={handleChange}
        required
      />

      <h2>Confirmar Contraseña:</h2>
      <input 
        name="confirm"
        type="password"
        placeholder="********"
        value={form.confirm}
        onChange={handleChange}
        required
      />

      <h2>Rol</h2>
      <input
        type="text"
        name="role"
        placeholder="Asistente de Gerencia"
        className="w-full px-3 py-2 border rounded-lg text-sm"
        disabled         // 🔥 importante
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button className="btn" type="submit">Registrarme</button>

      <div className="login-register">
        <p className="flex gap-2 justify-center mt-2">
          Ya tienes cuenta?
          <span className="register-link"> Haz Click Abajo :D </span>
        </p>
      </div>

      <button onClick={toggleMode} className="toggleBtn2 cursor-pointer mt-4">
        ¡ Y tengo cuenta !!!
      </button>
    </form>
  );
}
