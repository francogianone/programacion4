# Trabajo Practico Integrador - Primera Entrega

Ecommerce de libros. Arquitectura cliente-servidor con React + Node.js + MongoDB Atlas.

## Requisitos previos

- Node.js v18 o superior
- npm
- Cuenta en MongoDB Atlas

## Estructura del proyecto

```
program4/
  Backend/    API REST con Node.js, Express y Mongoose
  Frontend/   Aplicacion React con Vite
```

## Configuracion de variables de entorno

### Backend

Copiar `Backend/.env.example` a `Backend/.env` y completar los valores:

```
PORT=3000
MONGODB_URI=mongodb+srv://<usuario>:<contrasena>@cluster0.idv46rg.mongodb.net/productos?appName=Cluster0
```

### Frontend

Copiar `Frontend/.env.example` a `Frontend/.env` y completar los valores:

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

## Endpoints disponibles

### Productos

| Metodo | URL | Descripcion |
|--------|-----|-------------|
| GET | /api/productos | Listar productos activos |
| GET | /api/productos/:id | Obtener producto por id |
| POST | /api/productos | Crear producto |
| PUT | /api/productos/:id | Editar producto |
| DELETE | /api/productos/:id | Baja logica |

### Usuarios

| Metodo | URL | Descripcion |
|--------|-----|-------------|
| POST | /api/usuarios | Registrar usuario |

### Carrito

| Metodo | URL | Descripcion |
|--------|-----|-------------|
| POST | /api/carritos | Crear carrito |
| POST | /api/carritos/:id/productos | Agregar producto al carrito |

## Ejemplos de requests

### Crear producto

```
POST http://localhost:3000/api/productos
Content-Type: application/json

{
  "nombre": "Cien años de soledad",
  "precio": 2500,
  "categoria": "Literatura latinoamericana",
  "descripcion": "Gabriel García Márquez. La historia de la familia Buendía en Macondo."
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

### Editar producto

```
PUT http://localhost:3000/api/productos/<_id>
Content-Type: application/json

{
  "nombre": "Cien años de soledad",
  "precio": 2800,
  "categoria": "Literatura latinoamericana",
  "descripcion": "Edicion actualizada."
}
```

### Baja logica de producto

```
DELETE http://localhost:3000/api/productos/<_id>
```

### Registrar usuario

```
POST http://localhost:3000/api/usuarios
Content-Type: application/json

{
  "nombre": "Juan Perez",
  "email": "juan@email.com",
  "contrasena": "123456"
}
```

### Crear carrito

```
POST http://localhost:3000/api/carritos
Content-Type: application/json

{
  "usuario": "<_id del usuario>"
}
```

### Agregar producto al carrito

```
POST http://localhost:3000/api/carritos/<_id del carrito>/productos
Content-Type: application/json

{
  "productoId": "<_id del producto>",
  "cantidad": 2
}
```
