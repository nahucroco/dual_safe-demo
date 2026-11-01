// src/utils/cartEvents.js
export function openCart() {
  window.dispatchEvent(new CustomEvent("cart:open"));
}
export function closeCart() {
  window.dispatchEvent(new CustomEvent("cart:close"));
}
export function toggleCart() {
  window.dispatchEvent(new CustomEvent("cart:toggle"));
}
