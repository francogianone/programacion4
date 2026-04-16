# Trabajo Práctico Integrador - Tienda Online (Primera Entrega)

Este es el repositorio correspondiente a la primera entrega del Trabajo Práctico Integrador. La aplicación consiste en un sistema de Catálogo para una tienda, implementando una arquitectura Cliente-Servidor (Frontend y Backend).

## Estructura del proyecto

El proyecto está dividido en dos partes principales:
- `/`: Contiene el backend de Node.js + Express.js y los modelos de MongoDB.
- `/frontend/`: Contiene la aplicación web creada con React y Vite.

## Requisitos Previos

Asegúrate de contar con lo siguiente instalado en tu entorno local:
- [Node.js](https://nodejs.org/es/) (v16+)
- Acceso a una base de datos [MongoDB](https://www.mongodb.com/) en la nube (MongoDB Atlas) o instalación local.

## 🚀 Instalación y Ejecución

Sigue estos pasos para correr el proyecto localmente.

### 1. Configuración del Backend

1. Abre tu terminal en la raíz del proyecto (`programacion4`).
2. Instala las dependencias del backend:
   ```bash
   npm install
   ```
3. Verifica que el archivo `.env` en la raíz contiene las siguientes variables:
   ```env
   MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/productos?appName=Cluster0
   PORT=3000
   ```
   *Asegúrate también de que tu dirección IP esté dentro de la "Whitelist" en la pestaña "Network Access" de MongoDB.*

4. Inicia el servidor de desarrollo del backend:
   ```bash
   npm run dev
   ```
   Verás en la consola mensaje como `✓ Servidor escuchando en puerto 3000`.

### 2. Configuración del Frontend

1. Abre una **nueva** terminal y muévete a la carpeta frontend:
   ```bash
   cd frontend
   ```
2. Instala las dependencias de React:
   ```bash
   npm install
   ```
3. Inicia el entorno de desarrollo del frontend:
   ```bash
   npm run dev
   ```
4. Abre la dirección `http://localhost:5173` o en el puerto indicado, y podrás visualizar y utilizar el Catálogo.

## Funcionalidades Actuales (Backend)
- Usuarios: Creación.
- Productos: Alta, listar todos, obtener filtrado por id, actualización, e inhabilitación lógica.
- Carrito: Creación e inserción de nuevos productos/actualización de cantidades.

## Endpoints de la API
- **Productos:** `GET /api/productos`, `GET /api/productos/:id`, `POST /api/productos`, `PUT /api/productos/:id`, `DELETE /api/productos/:id`
- **Usuarios:** `POST /api/usuarios`
- **Carrito:** `POST /api/carritos`, `POST /api/carritos/:id/productos`

## Tecnologías Utilizadas
* **Frontend:** React, Vite, CSS puro, react-router-dom, lucide-react.
* **Backend:** Node.js, Express.js, Mongoose/MongoDB, dotenv, cors.
