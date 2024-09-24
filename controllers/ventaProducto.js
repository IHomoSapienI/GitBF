const VentaProducto = require('../modules/ventaProducto');

// Obtener todas las ventas de productos
exports.getVentasProductos = async (req, res) => {
    try {
        const ventas = await VentaProducto.find().populate('nombreProducto');
        res.json({ ventas });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las ventas', error });
    }
};

// Crear una nueva venta de producto
exports.createVentaProducto = async (req, res) => {
    const { nombreProducto, nombreCliente, descripcion, precio, cantidad, subtotal, total } = req.body;

    try {
        const nuevaVenta = new VentaProducto({
            nombreProducto,
            nombreCliente,
            descripcion,
            precio,
            cantidad,
            subtotal,
            total
        });
        await nuevaVenta.save();
        res.status(201).json({ message: 'Venta de producto creada', venta: nuevaVenta });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la venta', error });
    }
};

// Actualizar una venta de producto
exports.updateVentaProducto = async (req, res) => {
    const { id } = req.params;
    const { nombreProducto, nombreCliente, descripcion, precio, cantidad, subtotal, total } = req.body;

    try {
        const ventaActualizada = await VentaProducto.findByIdAndUpdate(id, {
            nombreProducto,
            nombreCliente,
            descripcion,
            precio,
            cantidad,
            subtotal,
            total
        }, { new: true });

        if (!ventaActualizada) {
            return res.status(404).json({ message: 'Venta no encontrada' });
        }

        res.json({ message: 'Venta actualizada', venta: ventaActualizada });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la venta', error });
    }
};

// Eliminar una venta de producto
exports.deleteVentaProducto = async (req, res) => {
    const { id } = req.params;

    try {
        const ventaEliminada = await VentaProducto.findByIdAndDelete(id);

        if (!ventaEliminada) {
            return res.status(404).json({ message: 'Venta no encontrada' });
        }

        res.json({ message: 'Venta eliminada' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la venta', error });
    }
};
