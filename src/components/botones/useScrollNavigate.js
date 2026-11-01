// useScrollNavigate.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useScrollNavigate() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  function go(to) {
    if (busy) return;
    setBusy(true);

    // duración estimada según distancia, con límites
    const duration = Math.min(700, Math.max(350, Math.floor(window.scrollY / 2)));

    // si el browser soporta 'scrollend', úsalo; si no, fallback con timeout
    const finish = () => {
      window.removeEventListener?.("scrollend", finish);
      navigate(to);
      setBusy(false);
    };

    if ("onscrollend" in window) {
      window.addEventListener("scrollend", finish, { once: true });
    } else {
      setTimeout(finish, duration);
    }

    /* window.scrollTo({ top: 0, behavior: "smooth" }); */
  }

  return { go, busy };
}
