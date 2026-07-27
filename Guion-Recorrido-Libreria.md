# Guion de recorrido — Librería (4 min)

> **Proyecto:** E-commerce de librería — Programación IV TUP UTN FRCU 2026  
> **Duración total:** 4 minutos  
> **Stack:** React + Vite (frontend) / Node.js + Express + MongoDB (backend)  
> **Despliegue:** Vercel (frontend) / Render (backend)

---

## 🏠 1. Home y catálogo (0:00 – 0:50)

| Tiempo | Acción | Qué decir |
|--------|--------|-----------|
| 0:00 | Abrir la app en el navegador, mostrar la landing | "Esta es la página principal del e-commerce de librería. Vemos el navbar con acceso a Productos, Contacto, Carrito e inicio de sesión." |
| 0:15 | Scrollear para mostrar productos destacados o categorías | "En el home tenemos secciones de productos destacados y categorías. Todo se consume desde una API REST propia alojada en Render, con base de datos MongoDB Atlas." |
| 0:35 | Ir a la sección de Productos (`/productos`) | "Vamos al catálogo completo de productos. Acá tenemos filtros por categoría, por precio, y una barra de búsqueda. El backend devuelve solo productos activos, paginados y filtrables." |
| 0:45 | Usar un filtro o buscar | "Por ejemplo, filtramos por la categoría Novelas o buscamos un título. Todo en tiempo real contra la API." |

---

## 🔍 2. Detalle de producto (0:50 – 1:10)

| Tiempo | Acción | Qué decir |
|--------|--------|-----------|
| 0:50 | Clic en un producto para ir al detalle | "Entramos al detalle del producto. Vemos imagen, descripción, precio, stock disponible. El stock se descuenta automáticamente al confirmar una compra." |
| 1:00 | Señalar botón "Agregar al carrito" | "Desde acá podemos agregar al carrito. El estado del carrito se maneja con React Context, y se persiste en localStorage para no perderlo al recargar." |

---

## 🛒 3. Carrito y cotización de envío (1:10 – 1:45)

| Tiempo | Acción | Qué decir |
|--------|--------|-----------|
| 1:10 | Ir al carrito (`/carrito`) | "Vamos al carrito. Acá vemos los items, cantidades, precio unitario y subtotal. Se pueden modificar cantidades o eliminar productos." |
| 1:25 | Mostrar el cotizador de envío | "Acá está el cotizador de envío: ingresás un código postal argentino y elegís entre envío a domicilio, retiro en correo o retiro en local. El backend calcula el costo según la zona geográfica por el prefijo del CP." |
| 1:40 | Señalar el resumen con total | "El carrito muestra subtotal, costo de envío y total final. Para continuar, se requiere iniciar sesión." |

---

## 🔐 4. Login y checkout (1:45 – 2:30)

| Tiempo | Acción | Qué decir |
|--------|--------|-----------|
| 1:45 | Si no hay sesión, redirige a login. Hacer login rápido | "Si no estamos logueados, nos redirige al login. El sistema usa JWT con tokens firmados. También hay registro público, recuperación de contraseña vía email, y restablecimiento con token." |
| 2:00 | Ir al checkout (`/checkout`) | "Ya autenticados, vamos al checkout. Completamos datos de facturación y envío. Elegimos método de pago: transferencia, efectivo o Mercado Pago." |
| 2:20 | Seleccionar Mercado Pago y confirmar | "Al confirmar con Mercado Pago, el backend genera una preferencia y nos redirige al checkout de MP. También se envía un email de confirmación al cliente vía Gmail SMTP." |

---

## 📦 5. Mis compras y perfil (2:30 – 2:55)

| Tiempo | Acción | Qué decir |
|--------|--------|-----------|
| 2:30 | Ir a Mis Compras (`/mis-compras`) | "El usuario puede ver el historial de sus órdenes en Mis Compras. Cada orden muestra productos, total, estado y método de pago." |
| 2:45 | Ir al Perfil (`/perfil`) | "Desde el perfil puede editar sus datos, cambiar contraseña (validando la anterior), y cerrar sesión." |

---

## 🛡️ 6. Panel de administración (2:55 – 3:50)

| Tiempo | Acción | Qué decir |
|--------|--------|-----------|
| 2:55 | Ir al Panel Admin (`/admin`) | "Los usuarios con rol admin acceden al panel de administración. Está protegido por middleware que verifica el rol en el JWT." |
| 3:05 | Ir a Productos | "En Productos podemos crear, editar, activar o desactivar productos. Cada producto tiene nombre, imagen, descripción, precio, categoría y stock." |
| 3:20 | Ir a Órdenes | "En Órdenes vemos todas las compras, con datos del cliente y estado. Podemos cambiar el estado: pendiente → confirmada → enviada → entregada. Cada cambio notifica al cliente por email automáticamente." |
| 3:35 | Ir a Usuarios | "En Usuarios gestionamos los registros: editar perfil, cambiar rol, dar de baja (inactivar), restaurar, o eliminar definitivamente con contraseña de admin." |

---

## 🔧 7. Arquitectura y cierre (3:50 – 4:00)

| Tiempo | Acción | Qué decir |
|--------|--------|-----------|
| 3:50 | Mostrar repo o estructura de carpetas | "La app está dividida en frontend con React + Vite y backend con Express. La autenticación usa JWT, los emails con Nodemailer/Gmail, pagos con Mercado Pago SDK, y la base de datos en MongoDB Atlas." |
| 3:57 | Cerrar | "Gracias. Eso es todo el recorrido. ¿Preguntas?" |

---

## 📋 Resumen de funcionalidades cubiertas

- [x] Catálogo con filtros y búsqueda
- [x] Detalle de producto
- [x] Carrito con persistencia (Context + localStorage)
- [x] Cotizador de envío por código postal
- [x] Registro y login con JWT
- [x] Recuperación de contraseña por email
- [x] Checkout con datos de facturación y envío
- [x] Pago con Mercado Pago (preferencia + webhook)
- [x] Notificaciones por email (confirmación, cambio de estado)
- [x] Historial de compras del usuario
- [x] Edición de perfil
- [x] Panel admin: ABM de productos
- [x] Panel admin: gestión de órdenes y cambio de estado
- [x] Panel admin: gestión de usuarios (baja, restauración, eliminación)