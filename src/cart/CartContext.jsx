// src/cart/CartContext.jsx
import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const CartContext = createContext(null);
const LS_KEY = "carrito:v1";

const initialState = { items: [] }; // items: [{ id, name, qty, price?, image?, categoria?, marca?, materials? }]

// --- Reducer ---
function cartReducer(state, action) {
  switch (action.type) {
    case "INIT":
      return action.payload || initialState;

    case "ADD_ITEM": {
      const { item, qty = 1 } = action.payload;
      const idx = state.items.findIndex((i) => i.id === item.id);
      let items;
      if (idx >= 0) {
        const prev = state.items[idx];
        items = state.items.map((i, k) =>
          k === idx ? { ...prev, qty: Math.min((prev.qty || 0) + qty, 999) } : i
        );
      } else {
        items = [...state.items, { ...item, qty: Math.min(qty, 999) }];
      }
      return { ...state, items };
    }

    case "UPDATE_QTY": {
      const { id, qty } = action.payload;
      const q = Math.max(0, Math.min(Number(qty) || 0, 999));
      const items = state.items
        .map((i) => (i.id === id ? { ...i, qty: q } : i))
        .filter((i) => i.qty > 0); // elimina si quedó en 0
      return { ...state, items };
    }

    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };

    case "CLEAR":
      return initialState;

    default:
      return state;
  }
}

// --- Helpers ---
function safeParse(json, fallback) {
  try {
    const data = JSON.parse(json);
    if (!data || typeof data !== "object" || !Array.isArray(data.items)) return fallback;
    return { items: data.items };
  } catch {
    return fallback;
  }
}

// Lazy init: se ejecuta solo una vez al montar el provider
function getInitialState() {
  if (typeof window === "undefined") return initialState;
  const raw = window.localStorage.getItem(LS_KEY);
  return raw ? safeParse(raw, initialState) : initialState;
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, getInitialState);

  // Persistir SIEMPRE ante cualquier cambio
  useEffect(() => {
    try {
      window.localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch {
      // Ignorar errores de storage (modo incógnito, cuotas, etc.)
    }
  }, [state]);

  // Sincronizar entre pestañas/ventanas
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === LS_KEY && e.newValue) {
        const incoming = safeParse(e.newValue, null);
        if (incoming) dispatch({ type: "INIT", payload: incoming });
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // API del carrito
  const value = useMemo(() => {
    const totalItems = state.items.reduce((acc, it) => acc + (it.qty || 0), 0);
    const subtotal = state.items.reduce(
      (acc, it) => acc + (Number(it.price || 0) * (it.qty || 0)),
      0
    );

    return {
      items: state.items,
      totalItems,
      subtotal,
      add: (item, qty = 1) => dispatch({ type: "ADD_ITEM", payload: { item, qty } }),
      updateQty: (id, qty) => dispatch({ type: "UPDATE_QTY", payload: { id, qty } }),
      remove: (id) => dispatch({ type: "REMOVE_ITEM", payload: id }),
      clear: () => dispatch({ type: "CLEAR" }),
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
