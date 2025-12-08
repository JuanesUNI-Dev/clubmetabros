"use client";

import { useState, useEffect } from "react";
import Login from "./Login";
import Login2 from "./Login2";

export default function LoginWrapper() {
  const [isRegister, setIsRegister] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleMode = () => setIsRegister((prev) => !prev);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className={`container w-full h-full ${isRegister ? "active" : ""}`}>

      {/* DESKTOP: ambos paneles */}
      {!isMobile && (
        <>
          <Login isRegister={isRegister} toggleMode={toggleMode} />
          <Login2 isRegister={isRegister} toggleMode={toggleMode} />
        </>
      )}

      {/* MOBILE: solo el formulario real */}
      {isMobile && (
        <Login2 isRegister={isRegister} toggleMode={toggleMode} isMobile />
      )}
    </div>
  );
}
