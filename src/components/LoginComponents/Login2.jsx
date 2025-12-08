// src/components/LoginComponents/Login2.jsx

import LoginForm from "@/components/LoginComponents/LoginFormLogin.jsx";
import RegisterForm from "@/components/LoginComponents/LoginFormRegistro";

export default function Login2({ isRegister, toggleMode }) {
  return (
    <div className="rightPanel sm:scale-75 ">
      <button onClick={() => window.location.href = "/"} className={`inline-flex items-center px-3 py-2 text-lg bg-[rgb(204,153,0)] 
        text-[rgb(25,50,90)] font-bold rounded-full shadow-2xl 
        hover:bg-opacity-90 transition duration-300 transform hover:scale-80 flex items-center mx-auto`}>VOLVER AL LOBBY</button>
      <div className="header">
        
        <img 
          onClick={() => window.location.href = "/"}
          src="/logos/logoMeta.png"
          alt="Corporacion Club El Meta Logo"
          className="h-40 w-auto mr-2 mt-4"
        />
        <div></div>
        <h2 className="mt-3 font-bold font-anton text-2xl">
          {isRegister ? "Registrarse" : "Iniciar sesión"}
        </h2>
      </div>

      {/* Aquí es donde cambia todo */}
      {isRegister ? (
        <RegisterForm toggleMode={toggleMode} />
      ) : (
        <LoginForm toggleMode={toggleMode} />
      )}

    </div>
  );
}
