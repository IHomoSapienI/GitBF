const VentaProducto = require('../modules/ventaproductos');
const Producto = require('../modules/producto');  // Importamos el modelo de Producto

// Obtener todas las ventas
const obtenerVentasProductos = async (req, res) => {
    try {
        const ventas = await VentaProducto.find().populate('nombreProducto', 'nombre precio');  // Relación con Producto
        res.status(200).json({
            ok: true,
            ventaproductos: ventas
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener las ventas'
        });
    }
};

// Crear una nueva venta de producto
const crearVentaProducto = async (req, res) => {
    try {
        // Obtener el producto para acceder a su precio
        const producto = await Producto.findById(req.body.nombreProducto);
        if (!producto) {
            return res.status(404).json({
                ok: false,
                msg: 'Producto no encontrado'
            });
        }

        // Crear una nueva venta con el precio del producto
        const nuevaVenta = new VentaProducto({
            ...req.body,
            precio: producto.precio,  // Asignar el precio del producto
            subtotal: req.body.cantidad * producto.precio,  // Calcular subtotal
            total: req.body.cantidad * producto.precio  // Puedes agregar otros valores para calcular el total
        });

        await nuevaVenta.save();
        res.status(201).json({
            ok: true,
            msg: 'Venta de producto creada con éxito',
            venta: nuevaVenta
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al crear la venta de producto'
        });
    }
};

// Actualizar una venta de producto
const actualizarVentaProducto = async (req, res) => {
    const { id } = req.params;
    try {
        // Obtener el producto para acceder a su precio
        const producto = await Producto.findById(req.body.nombreProducto);
        if (!producto) {
            return res.status(404).json({
                ok: false,
                msg: 'Producto no encontrado'
            });
        }

        // Actualizar la venta con el precio y recalcular subtotal y total
        const ventaActualizada = await VentaProducto.findByIdAndUpdate(id, {
            ...req.body,
            precio: producto.precio,  // Asignar el precio actualizado del producto
            subtotal: req.body.cantidad * producto.precio,  // Recalcular subtotal
            total: req.body.cantidad * producto.precio  // Recalcular total
        }, { new: true });

        res.status(200).json({
            ok: true,
            msg: 'Venta actualizada con éxito',
            venta: ventaActualizada
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar la venta de producto'
        });
    }
};

// Eliminar una venta de producto
const eliminarVentaProducto = async (req, res) => {
    const { id } = req.params;
    try {
        await VentaProducto.findByIdAndDelete(id);
        res.status(200).json({
            ok: true,
            msg: 'Venta eliminada con éxito'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al eliminar la venta de producto'
        });
    }
};

module.exports = {
    obtenerVentasProductos,
    crearVentaProducto,
    actualizarVentaProducto,
    eliminarVentaProducto
};
