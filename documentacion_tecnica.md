# Trabajo Práctico Integrador – Documentación Técnica
**Primera Entrega**

## 1. Requerimientos Funcionales

Esta primera fase del sistema cumple con los siguientes requerimientos:

### Módulo de Productos (Catálogo)
- El sistema permite listar todos los productos disponibles en la base de datos que se encuentren con el estatus "activo".
- El sistema permite mostrar el detalle completo de un producto en particular ingresando por su ID.
- El sistema cuenta con ABM (Alta, Baja y Modificación) de productos:
  - Creación de producto (ingreso de nombre, precio de lista, categoría, descripción).
  - Modificación de sus atributos principales.
  - El sistema no elimina productos físicamente de la base de datos; implementa una **baja lógica** marcando su bandera `activo: false`.

### Módulo de Usuarios
- El sistema permite el registro de nuevos usuarios en el sistema ingresando al menos nombre, correo y contraseña. (En esta etapa, la autenticación no está implementada y no es requerida).

### Módulo de Carrito de Compras
- El sistema asocia un carrito a un usuario válido en el momento de la pre-compra.
- El sistema puede acumular nuevos ítems dentro del carrito, incrementando la cantidad en caso de que el usuario vuelva a agregar un ítem preexistente en la misma orden.

### Frontend
- Existe una interfaz web construida en React para el consumidor final.
- **Vista de Catálogo**: Renderiza todos los elementos y muestra su categoría, nombre y precio.
- **Vista de Detalle**: Muestra exhaustivamente la descripción, precio visible, título e incluye una simulación de botón de compra.

---

## 2. Diagrama de Arquitectura del Sistema

El proyecto está diseñado bajo una arquitectura Cliente-Servidor clásica, de 3 capas.

```mermaid
graph TD
    %% Componentes
    subgraph Client [Capa de Presentación / Frontend]
        ReactApp["React Application (Vite)\nPuerto: 5173"]
        Catalog["Product Catalog View"]
        Detail["Product Detail View"]
        ReactApp --- Catalog
        ReactApp --- Detail
    end

    subgraph Server [Capa de Negocio / Backend (Node.js)]
        Express["Express.js API Server\nPuerto: 3000"]
        Routes["Rutas (Productos, Usuarios, Carrito)"]
        Controllers["Controladores"]
        Models["Modelos (Mongoose)"]
        
        Express --> Routes
        Routes --> Controllers
        Controllers --> Models
    end

    subgraph Data [Capa de Datos]
        MongoDB[("MongoDB Atlas\n(Base de datos en la Nube)")]
    end

    %% Relaciones
    Client <==>|Peticiones HTTP (JSON/CORS)| Express
    Models <==>|Conexión asíncrona URI Mongoose| MongoDB
```

**Flujo de Comunicación:**
1. El usuario interactúa visualmente con la aplicación React de Frontend (`localhost:5173`).
2. Cuando el frontend necesita los productos, efectúa una peticion HTTP a la API alojada en la capa de Backend sobre Node.js + Express (`localhost:3000/api/...`).
3. El Backend recibe el llamado, las rutas derivan al controlador correspondiente, que interactúa con Mongoose invocando métodos como `Producto.find()`.
4. Mongoose abre comunicación con MongoDB Atlas en la nube, recuperando los documentos que cumplen los requisitos.
5. El flujo se devuelve en una respuesta JSON asíncrona hacia el Backend, quien le da formato de respuesta exitosa `200 OK` para que el React Frontend los represente en la grilla visual.

---

## 3. Requisitos Técnicos Implementados

- **Uso de Variables de Entorno**: Incorporado directamente en el archivo `.env` del backend (configuraciones sensibles de acceso a Atlas y el Puerto). Centralizado usando la librería `dotenv`.
- **Manejo básico de errores**: Se aplicó uso bloques de rescate `try/catch` de JS moderno para operaciones asíncronas y validaciones `if (!producto)` devolviendo el status de error acorde (ej. `404 Not Found` en caso de no existir, o `500 Server Error`).
- **Respuestas en formato JSON**: Tanto el éxito como el fracaso emiten un objeto JavaScript parseado, asegurando en los encabezados `Content-Type: application/json`.
- **Persistencia**: La estructura se sostiene gracias a un clúster gratuito de MongoDB.
