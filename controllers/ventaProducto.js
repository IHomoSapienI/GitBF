const VentaProducto = require('../modules/ventaproductos');

// Crear una nueva venta
const crearVenta = async (req, res) => {
    try {
        const { nombreProducto, nombreCliente, descripcion, precio, cantidad } = req.body;

        // Verificar que el producto y el cliente existan
        const producto = await Producto.findById(nombreProducto);
        const cliente = await Cliente.findById(nombreCliente);

        if (!producto) {
            return res.status(400).json({ msg: 'Producto no encontrado' });
        }

        if (!cliente) {
            return res.status(400).json({ msg: 'Cliente no encontrado' });
        }

        const venta = new VentaProducto({
            nombreProducto,
            nombreCliente,
            descripcion,
            precio,
            cantidad,
            subtotal: cantidad * precio,
            total: cantidad * precio // Asume que el total es igual al subtotal en esta fase
        });

        await venta.save();
        res.status(201).json(venta);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al crear la venta' });
    }
};

// Obtener todas las ventas
const obtenerVentas = async (req, res) => {
    try {
        const ventas = await VentaProducto.find()
            .populate('nombreProducto')  // Populate para obtener datos del producto
            .populate('nombreCliente');  // Populate para obtener datos del cliente

        res.status(200).json(ventas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener las ventas' });
    }
};

// Obtener una venta por ID
const obtenerVentaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const venta = await VentaProducto.findById(id)
            .populate('nombreProducto')
            .populate('nombreCliente');

        if (!venta) {
            return res.status(404).json({ msg: 'Venta no encontrada' });
        }

        res.status(200).json(venta);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener la venta' });
    }
};

// Actualizar una venta
const actualizarVenta = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombreProducto, nombreCliente, descripcion, precio, cantidad } = req.body;

        let venta = await VentaProducto.findById(id);

        if (!venta) {
            return res.status(404).json({ msg: 'Venta no encontrada' });
        }

        // Verificar que el producto y el cliente existan
        const producto = await Producto.findById(nombreProducto);
        const cliente = await Cliente.findById(nombreCliente);

        if (!producto) {
            return res.status(400).json({ msg: 'Producto no encontrado' });
        }

        if (!cliente) {
            return res.status(400).json({ msg: 'Cliente no encontrado' });
        }

        venta.nombreProducto = nombreProducto || venta.nombreProducto;
        venta.nombreCliente = nombreCliente || venta.nombreCliente;
        venta.descripcion = descripcion || venta.descripcion;
        venta.precio = precio || venta.precio;
        venta.cantidad = cantidad || venta.cantidad;

        venta.subtotal = venta.cantidad * venta.precio;
        venta.total = venta.subtotal; // Actualiza el total también

        await venta.save();
        res.status(200).json(venta);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar la venta' });
    }
};

// Eliminar una venta
const eliminarVenta = async (req, res) => {
    try {
        const { id } = req.params;

        const venta = await VentaProducto.findById(id);

        if (!venta) {
            return res.status(404).json({ msg: 'Venta no encontrada' });
        }

        await venta.remove();
        res.status(200).json({ msg: 'Venta eliminada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al eliminar la venta' });
    }
};

module.exports = {
    crearVenta,
    obtenerVentas,
    obtenerVentaPorId,
    actualizarVenta,
    eliminarVenta
};
