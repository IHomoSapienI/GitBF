const Producto = require('../modules/producto');
const CategoriaProducto = require('../modules/categoriaproducto');

// Crear un nuevo producto
const crearProducto = async (req, res) => {
    const { nombreProducto, precio, categoria, imagenUrl } = req.body;

    try {
        // Verificar que la categoría exista
        const categoriaExistente = await CategoriaProducto.findById(categoria);
        if (!categoriaExistente) {
            return res.status(400).json({
                msg: 'La categoría especificada no existe'
            });
        }

        // Crear un nuevo producto
        const nuevoProducto = new Producto({ nombreProducto, precio, categoria, imagenUrl });
        await nuevoProducto.save();

        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({ msg: 'Error en el servidor al crear el producto' });
    }
};

// Obtener todos los productos
const obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.find().populate('categoria', 'nombreCp');
        res.json(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ msg: 'Error en el servidor al obtener productos' });
    }
};

// Obtener un producto por ID
const obtenerProductoPorId = async (req, res) => {
    const { id } = req.params;
    
    try {
        const producto = await Producto.findById(id).populate('categoria', 'nombreCp');
        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ msg: 'Error en el servidor al obtener el producto' });
    }
};

// Actualizar un producto
const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const { nombreProducto, precio, categoria, imagenUrl } = req.body;

    try {
        // Verificar que el producto exista
        let producto = await Producto.findById(id);
        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        // Verificar que la categoría exista
        const categoriaExistente = await CategoriaProducto.findById(categoria);
        if (!categoriaExistente) {
            return res.status(400).json({
                msg: 'La categoría especificada no existe'
            });
        }

        // Actualizar el producto
        producto.nombreProducto = nombreProducto;
        producto.precio = precio;
        producto.categoria = categoria;
        producto.imagenUrl = imagenUrl;

        await producto.save();

        res.json(producto);
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ msg: 'Error en el servidor al actualizar el producto' });
    }
};

// Eliminar un producto
const eliminarProducto = async (req, res) => {
    const { id } = req.params;

    try {
        const producto = await Producto.findById(id);
        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        await producto.remove();
        res.json({ msg: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ msg: 'Error en el servidor al eliminar el producto' });
    }
};

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto
};
