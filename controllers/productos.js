const Producto = require('../modules/producto'); // Asegúrate de que la ruta sea correcta

// Obtener todos los productos
const obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.find().populate('categoria', 'nombreCategoria'); // Asegúrate de que el campo nombreCategoria exista en tu esquema CatProducto
        res.status(200).json({ productos });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error al obtener productos' });
    }
};

// Crear un nuevo producto
const crearProducto = async (req, res) => {
    const { nombreProducto, precio, stock, categoria, estado, imagenUrl } = req.body;

    try {
        const nuevoProducto = new Producto({
            nombreProducto,
            precio,
            stock,
            categoria,
            estado,
            imagenUrl
        });

        const productoGuardado = await nuevoProducto.save();
        res.status(201).json({ producto: productoGuardado });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ message: 'Error al crear producto' });
    }
};

// Actualizar un producto
const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const { nombreProducto, precio, stock, categoria, estado, imagenUrl } = req.body;

    try {
        const productoActualizado = await Producto.findByIdAndUpdate(id, {
            nombreProducto,
            precio,
            stock,
            categoria,
            estado,
            imagenUrl
        }, { new: true });

        if (!productoActualizado) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json({ producto: productoActualizado });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ message: 'Error al actualizar producto' });
    }
};

// Eliminar un producto
const eliminarProducto = async (req, res) => {
    const { id } = req.params;

    try {
        const productoEliminado = await Producto.findByIdAndDelete(id);
        if (!productoEliminado) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json({ message: 'Producto eliminado' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ message: 'Error al eliminar producto' });
    }
};


module.exports = {
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};
