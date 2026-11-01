# DualSafe · demo

Sitio y catálogo de productos desarrollado para DualSafe, una empresa de seguridad industrial y equipos
de protección personal. Esta copia es una **demo de portfolio**: no es el sitio oficial de la empresa.

## Diferencias con el sitio original

- El catálogo muestra una muestra de productos desde `public/productos.json`, en lugar del CMS original.
- El carrito funciona, pero el pedido no se envía: en lugar de abrir WhatsApp, muestra el mensaje que
  recibiría la empresa.
- El formulario de contacto muestra el mismo recorrido, pero no envía ni guarda datos.
- Se quitaron EmailJS, el chat de Botpress, Google Tag Manager y los datos de contacto.
- Los buscadores no indexan la demo.

## Tecnologías

- React 19, React Router y Vite
- JavaScript y CSS, con diseño responsive
- Prototipado en Figma

## Correrla en local

```bash
npm ci
npm run dev
```

## Despliegue

`render.yaml` define un sitio estático para Render (plan gratuito).

Desarrollado en Octopush.
