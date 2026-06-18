# Trabajo Practico Integrador - Entrega Final

Ecommerce de libros. Arquitectura cliente-servidor con React + Node.js + MongoDB Atlas.

## Requisitos previos

- Node.js v18 o superior
- npm
- Cuenta en MongoDB Atlas
- Cuenta de Gmail con contraseña de aplicacion habilitada (para recuperacion de contrasena)

## Estructura del proyecto

```
/
  Backend/    API REST con Node.js, Express y Mongoose
  Frontend/   Aplicacion React con Vite
```

## Configuracion de variables de entorno

### Backend

Crear `Backend/.env` con los siguientes valores:

```
PORT=3000
MONGODB_URI=mongodb+srv://<usuario>:<contrasena>@cluster0.idv46rg.mongodb.net/<nombre_db>?appName=Cluster0
JWT_SECRET=<clave_secreta_jwt>
GMAIL_USER=<correo_gmail>
GMAIL_PASS=<contrasena_de_aplicacion_gmail>
FRONTEND_URL=http://localhost:5173
```

### Frontend

Crear `Frontend/.env` con los siguientes valores:

```
VITE_API_URL=http://localhost:3000
```

## Instalacion de dependencias

### Backend

```bash
cd Backend
npm install
```

### Frontend

```bash
cd Frontend
npm install
```

## Ejecucion

Iniciar ambos servidores en terminales separadas.

### Backend

```bash
cd Backend
npm run dev
```

Servidor disponible en `http://localhost:3000`

### Frontend

```bash
cd Frontend
npm run dev
```

Aplicacion disponible en `http://localhost:5173`

## Crear usuario administrador

Para crear el primer usuario con rol `admin`, ejecutar el seeder incluido:

```bash
cd Backend
npm run seed
```

## Dependencias

### Backend

| Paquete | Version | Uso |
|---------|---------|-----|
| express | ^5.2.1 | Framework HTTP |
| mongoose | ^9.3.1 | ODM para MongoDB |
| mongodb | ^7.2.0 | Driver de MongoDB |
| bcrypt | ^6.0.0 | Encriptacion de contrasenas |
| jsonwebtoken | ^9.0.3 | Autenticacion JWT |
| nodemailer | ^8.0.9 | Envio de emails (recuperacion de contrasena) |
| dotenv | ^17.3.1 | Variables de entorno |
| cors | ^2.8.6 | Politica CORS |
| nodemon | ^3.1.11 | Recarga automatica en desarrollo |

### Frontend

| Paquete | Uso |
|---------|-----|
| react + react-dom | Framework UI |
| react-router-dom | Ruteo del lado cliente |
| axios | Cliente HTTP |
| sweetalert2 | Modales y alertas |
| lucide-react | Iconografia |
| vite | Bundler y servidor de desarrollo |

## Endpoints disponibles

### Productos

| Metodo | URL | Auth | Descripcion |
|--------|-----|------|-------------|
| GET | /api/productos | Publica | Listar productos activos |
| GET | /api/productos/:id | Publica | Obtener producto por id |
| GET | /api/productos/inactivos | Admin | Listar productos dados de baja |
| POST | /api/productos | Admin | Crear producto |
| PUT | /api/productos/:id | Admin | Editar producto |
| DELETE | /api/productos/:id | Admin | Baja logica de producto |
| PATCH | /api/productos/:id/restaurar | Admin | Restaurar producto dado de baja |

### Usuarios

| Metodo | URL | Auth | Descripcion |
|--------|-----|------|-------------|
| POST | /api/usuarios/registro | Publica | Registrar usuario |
| POST | /api/usuarios/login | Publica | Iniciar sesion |
| POST | /api/usuarios/recuperar-contrasena | Publica | Solicitar recuperacion de contrasena |
| POST | /api/usuarios/restablecer-contrasena | Publica | Restablecer contrasena con token |
| GET | /api/usuarios/perfil | Autenticado | Ver perfil propio |
| PUT | /api/usuarios/perfil | Autenticado | Editar perfil propio |
| GET | /api/usuarios | Admin | Listar todos los usuarios |
| PUT | /api/usuarios/:id | Admin | Editar usuario |
| PATCH | /api/usuarios/:id/baja | Admin | Dar de baja usuario |
| PATCH | /api/usuarios/:id/restaurar | Admin | Restaurar usuario dado de baja |

### Carrito

| Metodo | URL | Auth | Descripcion |
|--------|-----|------|-------------|
| POST | /api/carritos | Autenticado | Crear carrito |
| POST | /api/carritos/:id/productos | Autenticado | Agregar producto al carrito |
| PATCH | /api/carritos/:id/productos/:productoId | Autenticado | Modificar cantidad de un producto |
| DELETE | /api/carritos/:id/productos/:productoId | Autenticado | Eliminar producto del carrito |
| DELETE | /api/carritos/:id | Autenticado | Vaciar carrito |

### Ordenes

| Metodo | URL | Auth | Descripcion |
|--------|-----|------|-------------|
| POST | /api/ordenes | Autenticado | Generar orden de compra |
| GET | /api/ordenes/mis-compras | Autenticado | Ver ordenes propias |
| GET | /api/ordenes/:id | Autenticado | Ver detalle de una orden |
| GET | /api/ordenes | Admin | Ver todas las ordenes |
| PATCH | /api/ordenes/:id/estado | Admin | Actualizar estado y notificar al cliente por email |

### Contacto

| Metodo | URL | Auth | Descripcion |
|--------|-----|------|-------------|
| POST | /api/contacto | Publica | Enviar mensaje de contacto |

## Ejemplos de requests

### Registrar usuario

```
POST http://localhost:3000/api/usuarios/registro
Content-Type: application/json

{
  "nombre": "Juan Perez",
  "email": "juan@email.com",
  "contrasena": "123456"
}
```

### Iniciar sesion

```
POST http://localhost:3000/api/usuarios/login
Content-Type: application/json

{
  "email": "juan@email.com",
  "contrasena": "123456"
}
```

### Crear producto (requiere token de admin)

```
POST http://localhost:3000/api/productos
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Cien anos de soledad",
  "precio": 2500,
  "categoria": "Literatura latinoamericana",
  "descripcion": "Gabriel Garcia Marquez. La historia de la familia Buendia en Macondo.",
  "stock": 10
}
```

### Listar todos los productos

```
GET http://localhost:3000/api/productos
```

### Obtener producto por id

```
GET http://localhost:3000/api/productos/<_id>
```

### Editar producto (requiere token de admin)

```
PUT http://localhost:3000/api/productos/<_id>
Authorization: Bearer <token>
Content-Type: application/json

{
  "nombre": "Cien anos de soledad",
  "precio": 2800,
  "categoria": "Literatura latinoamericana",
  "descripcion": "Edicion actualizada.",
  "stock": 8
}
```

### Baja logica de producto (requiere token de admin)

```
DELETE http://localhost:3000/api/productos/<_id>
Authorization: Bearer <token>
```

### Crear carrito (requiere token)

```
POST http://localhost:3000/api/carritos
Authorization: Bearer <token>
Content-Type: application/json

{}
```

### Agregar producto al carrito (requiere token)

```
POST http://localhost:3000/api/carritos/<_id del carrito>/productos
Authorization: Bearer <token>
Content-Type: application/json

{
  "productoId": "<_id del producto>",
  "cantidad": 2
}
```

### Generar orden de compra (requiere token)

```
POST http://localhost:3000/api/ordenes
Authorization: Bearer <token>
Content-Type: application/json

{
  "productos": [
    { "productoId": "<_id>", "cantidad": 1 }
  ],
  "costoEnvio": 500,
  "metodoPago": "transferencia",
  "tipoEntrega": "envio",
  "datosFacturacion": {
    "nombre": "Juan Perez",
    "dni": "12345678",
    "domicilio": "Av. Siempreviva 742"
  },
  "datosEnvio": {
    "domicilio": "Av. Siempreviva 742",
    "localidad": "Springfield",
    "provincia": "Entre Rios",
    "cp": "3260"
  }
}
```

### Recuperar contrasena

```
POST http://localhost:3000/api/usuarios/recuperar-contrasena
Content-Type: application/json

{
  "email": "juan@email.com"
}
```

### Restablecer contrasena

```
POST http://localhost:3000/api/usuarios/restablecer-contrasena
Content-Type: application/json

{
  "token": "<token_recibido_por_email>",
  "nuevaContrasena": "nueva123"
}
```

### Enviar mensaje de contacto

```
POST http://localhost:3000/api/contacto
Content-Type: application/json

{
  "nombre": "Maria Lopez",
  "email": "maria@email.com",
  "mensaje": "Hola, quisiera saber si tienen envio a Mendoza."
}
```

## Rutas del frontend

| Ruta | Acceso | Descripcion |
|------|--------|-------------|
| / | Publica | Home |
| /productos | Publica | Catalogo de productos |
| /productos/:id | Publica | Detalle de producto |
| /carrito | Publica | Carrito de compras |
| /login | Publica | Inicio de sesion |
| /register | Publica | Registro de usuario |
| /recuperar-contrasena | Publica | Solicitar recuperacion de contrasena |
| /restablecer-contrasena | Publica | Restablecer contrasena con token |
| /contacto | Publica | Formulario de contacto |
| /perfil | Autenticado | Ver y editar perfil |
| /mis-compras | Autenticado | Ver ordenes propias |
| /checkout | Autenticado | Confirmar compra |
| /admin | Admin | Panel de administracion |
| /admin/productos | Admin | Gestion de productos |
| /admin/usuarios | Admin | Gestion de usuarios |
| /admin/ordenes | Admin | Gestion de ordenes |
