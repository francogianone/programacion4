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

La documentación detallada de la API, junto con los métodos HTTP, rutas, parámetros y respuestas JSON de todos los módulos (Auth, Productos, Carrito, Órdenes, Usuarios) se encuentra en el archivo [DOCUMENTACION_FINAL.md](./DOCUMENTACION_FINAL.md).

## Instalación y Ejecución Rápida

1. Instalar dependencias en ambas carpetas:
   - En `Backend/`: ejecutar `npm install`
   - En `Frontend/`: ejecutar `npm install`
2. Configurar variables de entorno (`.env`) en ambas carpetas guiándose con los archivos `.env.example`.
3. Iniciar Backend: `npm run dev` en la carpeta Backend (corre en puerto 3000).
4. Iniciar Frontend: `npm run dev` en la carpeta Frontend (corre en puerto 5173).
