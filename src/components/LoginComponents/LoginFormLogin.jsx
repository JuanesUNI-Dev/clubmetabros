// src/components/LoginComponents/LoginFormLogin.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { postLogin } from "@/lib/api/Auth/users";

export default function LoginForm({ toggleMode }) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    const { ok, data } = await postLogin({ email, password });

    if (!ok) {
      setError(data.message);
      return;
    }

    router.push("/admin");
  };

  return (
    <form onSubmit={submit}>
      <h2>Correo Electronico:</h2>
      <input 
        type="email"
        placeholder="pepito@perez.com"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <h2>Contraseña:</h2>
      <input 
        type="password"
        placeholder="********"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button className="btn" type="submit">Iniciar Sesión</button>

      <div className="login-register">
          <p className="flex gap-2 justify-center mt-2">
            No tienes cuenta?
            <span className="register-link"> Haz Click Abajo :D </span>
          </p>
        </div>
        <button onClick={toggleMode} className="toggleBtn2 cursor-pointer mt-4">
           ¡ No tengo cuenta !
        </button>
    </form>
  );
}
