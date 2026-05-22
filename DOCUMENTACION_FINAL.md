# Documentación Entrega Final - E-commerce Grupo 5

## 1. Requerimientos Funcionales Actualizados
La aplicación de E-commerce es un sistema Full Stack desarrollado con Node.js, Express, MongoDB y React.

### Funcionalidades Generales
- Arquitectura Cliente-Servidor separada (Frontend en puerto 5173, Backend en puerto 3000).
- Estado global en frontend utilizando React Context (AuthContext y CartContext).
- Persistencia de datos en base de datos NoSQL MongoDB (Mongoose).
- Variables de entorno para configuración sensible.

### Autenticación y Usuarios
- Registro de usuarios con validación y cifrado de contraseñas mediante `bcrypt`.
- Inicio de sesión con autenticación basada en tokens JWT (`jsonwebtoken`).
- Roles de usuario: `cliente` (por defecto) y `admin`.
- Recuperación de contraseña (flujo de solicitud y restablecimiento de token temporario).
- Perfil de usuario para consultar y actualizar datos personales.
- Protección de rutas en Frontend (mediante `ProtectedRoute`) y Backend (mediante middlewares `proteger` y `admin`).

### Gestión de Productos
- Catálogo de productos público (visualizar nombre, descripción, categoría, precio y stock).
- Control de stock integrado.
- Panel de Administrador para CRUD de productos (Creación, Edición y Baja lógica).

### Carrito de Compras
- Carrito vinculado automáticamente a la sesión del usuario (vía JWT).
- Acciones soportadas: Agregar productos, Modificar cantidades, Eliminar items específicos y Vaciar el carrito.
- Cálculo automático del total en tiempo real.

### Órdenes de Compra
- Generación de orden a partir de un carrito activo.
- Descuento automático de stock en la base de datos al confirmar la compra.
- Historial de órdenes visible para el cliente (Mis Órdenes).
- Historial global y actualización de estado de órdenes reservado para administradores.

---

## 2. Documentación de Endpoints (API REST)

**URL Base:** `http://localhost:3000/api`

### 🛡️ Usuarios (`/usuarios`)

| Método | Endpoint | Middleware | Descripción | Body (JSON) | Respuesta (JSON) |
|---|---|---|---|---|---|
| `POST` | `/registro` | Público | Registra un nuevo usuario | `nombre`, `email`, `contrasena` | Datos del usuario y `token` |
| `POST` | `/login` | Público | Autentica un usuario | `email`, `contrasena` | Datos del usuario y `token` |
| `POST` | `/recuperar-password`| Público | Solicita token de recup. | `email` | `mensaje` de éxito |
| `PUT` | `/reset-password/:token`| Público | Restablece la contraseña | `contrasena` | Datos del usuario y `token` |
| `GET` | `/perfil` | `proteger` | Obtiene el perfil del usuario logueado | N/A | Datos del usuario |
| `PUT` | `/perfil` | `proteger` | Actualiza nombre o password | `nombre`, `contrasena` (opc) | Datos del usuario actualizados |
| `GET` | `/` | `admin` | Lista todos los usuarios | N/A | Array de usuarios |
| `PUT` | `/:id` | `admin` | Actualiza rol/estado usuario | `rol`, `activo` | Datos del usuario actualizados |
| `DELETE` | `/:id` | `admin` | Baja lógica de usuario | N/A | `mensaje` |

### 📦 Productos (`/productos`)

| Método | Endpoint | Middleware | Descripción | Body (JSON) | Respuesta (JSON) |
|---|---|---|---|---|---|
| `GET` | `/` | Público | Lista productos activos | N/A | Array de productos |
| `GET` | `/:id` | Público | Obtiene detalle de producto | N/A | Datos del producto |
| `POST` | `/` | `admin` | Crea nuevo producto | `nombre`, `precio`, `categoria`, `stock`, `descripcion` | Producto creado |
| `PUT` | `/:id` | `admin` | Actualiza un producto | `nombre`, `precio`, `categoria`, `stock`, `descripcion` | Producto actualizado |
| `DELETE` | `/:id` | `admin` | Baja lógica de producto | N/A | `mensaje` |

### 🛒 Carrito (`/carritos`) - *Todas requieren middleware `proteger`*

| Método | Endpoint | Descripción | Body (JSON) | Respuesta (JSON) |
|---|---|---|---|---|
| `GET` | `/` | Obtiene el carrito del usuario | N/A | Carrito populado con productos |
| `POST` | `/productos` | Agrega un producto | `productoId`, `cantidad` | Carrito actualizado |
| `PUT` | `/productos/:productoId`| Modifica la cantidad de un item | `cantidad` | Carrito actualizado |
| `DELETE` | `/productos/:productoId`| Elimina un item del carrito | N/A | Carrito actualizado |
| `DELETE` | `/` | Vacía el carrito por completo | N/A | Carrito vacío |

### 🧾 Órdenes (`/ordenes`)

| Método | Endpoint | Middleware | Descripción | Body (JSON) | Respuesta (JSON) |
|---|---|---|---|---|---|
| `POST` | `/` | `proteger` | Genera orden desde el carrito actual | N/A | Orden generada |
| `GET` | `/` | `proteger` | Obtiene historial del usuario logueado | N/A | Array de órdenes |
| `GET` | `/:id` | `proteger` | Obtiene detalle de una orden | N/A | Detalle de orden |
| `GET` | `/admin/todas` | `admin` | Obtiene todas las órdenes del sistema | N/A | Array de órdenes |
| `PUT` | `/:id/estado` | `admin` | Actualiza el estado de una orden | `estado` | Orden actualizada |

---
*Fin del documento.*
