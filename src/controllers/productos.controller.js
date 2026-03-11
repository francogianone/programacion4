const productos = require('../data/productos.data');

const obtenerProductos = (req, res) => {
  res.json(productos);
};

const obtenerProductoPorId = (req, res) => {
  const id = parseInt(req.params.id);

  const producto = productos.find(p => p.id === id);

  if (!producto) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  res.json(producto);
};

const crearProducto = (req, res) => {
  const { nombre, precio } = req.body;

  if (!nombre || !precio) {
    return res.status(400).json({ error: 'Nombre y precio son obligatorios' });
  }

  const nuevoProducto = {
    id: productos.length + 1,
    nombre,
    precio
  };

  productos.push(nuevoProducto);

  res.status(201).json(nuevoProducto);
};

const actualizarProducto = (req, res) => {
  const id = parseInt(req.params.id);
  const index = productos.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Producto no encontrado para actualizar' });
  }


  const { nombre, precio } = req.body;

  productos[index] = {
    id,
    nombre: nombre !== undefined ? nombre : productos[index].nombre,
    precio: precio !== undefined ? precio : productos[index].precio
  };

  res.status(200).json(productos[index]);
};

const eliminarProducto = (req, res) => {
  const id = parseInt(req.params.id);
  const index = productos.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Producto no encontrado para eliminar' });
  }


  const productoEliminado = productos.splice(index, 1);

  res.status(200).json(productoEliminado[0]);
};

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};
