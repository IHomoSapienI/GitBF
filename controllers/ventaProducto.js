const VentaProducto = require('../modules/ventaproductos');
const Producto = require('../modules/producto'); // Asegúrate de tener el modelo correcto
const Cliente = require('../modules/cliente'); // Asegúrate de tener el modelo correcto

// Crear una nueva venta de producto
const crearVentaProducto = async (req, res) => {
    try {
        const { productos, nombrecliente } = req.body; // Cambiado a nombrecliente

        // Verificar que el cliente exista
        const cliente = await Cliente.findById(nombrecliente); // Cambiado a nombrecliente
        if (!cliente) {
            return res.status(400).json({ msg: 'Cliente no encontrado' });
        }

        // Inicializar subtotal
        let subtotal = 0;

        // Verificar que cada producto exista y calcular subtotal
        for (let item of productos) {
            const producto = await Producto.findById(item.producto);
            if (!producto) {
                return res.status(400).json({ msg: `Producto no encontrado: ${item.producto}` });
            }

            // Calcular el subtotal para cada producto
            subtotal += item.cantidad * item.precio; // Asume que el precio es correcto
        }

        // Crear la venta
        const venta = new VentaProducto({
            productos,
            nombrecliente, // Cambiado a nombrecliente
            subtotal,
            total: subtotal, // Cambia si deseas agregar impuestos o descuentos
            estado: true,  // Por defecto el estado es verdadero (completado)
            fechaVenta: new Date() // Asigna la fecha actual
        });

        await venta.save();
        res.status(201).json(venta);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al crear la venta de producto' });
    }
};

// Obtener todas las ventas de productos
const obtenerVentasProductos = async (req, res) => {
    try {
        const ventas = await VentaProducto.find()
            .populate('productos.producto')  // Populate para obtener datos del producto
            .populate('nombrecliente');  // Cambiado a nombrecliente

        res.status(200).json(ventas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener las ventas de productos' });
    }
};

// Obtener una venta de producto por ID
const obtenerVentaProductoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const venta = await VentaProducto.findById(id)
            .populate('productos.producto')
            .populate('nombrecliente');  // Cambiado a nombrecliente

        if (!venta) {
            return res.status(404).json({ msg: 'Venta de producto no encontrada' });
        }

        res.status(200).json(venta);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener la venta de producto' });
    }
};

// Actualizar una venta de producto
const actualizarVentaProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { productos, nombrecliente } = req.body; // Cambiado a nombrecliente

        let venta = await VentaProducto.findById(id);

        if (!venta) {
            return res.status(404).json({ msg: 'Venta de producto no encontrada' });
        }

        // Verificar que el cliente exista
        const cliente = await Cliente.findById(nombrecliente); // Cambiado a nombrecliente
        if (!cliente) {
            return res.status(400).json({ msg: 'Cliente no encontrado' });
        }

        // Inicializar subtotal
        let subtotal = 0;

        // Verificar que cada producto exista y calcular subtotal
        for (let item of productos) {
            const producto = await Producto.findById(item.producto);
            if (!producto) {
                return res.status(400).json({ msg: `Producto no encontrado: ${item.producto}` });
            }

            // Calcular el subtotal para cada producto
            subtotal += item.cantidad * item.precio; // Asume que el precio es correcto
        }

        // Actualizar la venta
        venta.productos = productos;
        venta.nombrecliente = nombrecliente; // Cambiado a nombrecliente
        venta.subtotal = subtotal;
        venta.total = subtotal; // Cambia si deseas agregar impuestos o descuentos

        await venta.save();
        res.status(200).json(venta);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar la venta de producto' });
    }
};

// Eliminar una venta de producto
const eliminarVentaProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const venta = await VentaProducto.findById(id);

        if (!venta) {
            return res.status(404).json({ msg: 'Venta de producto no encontrada' });
        }

        await venta.remove();
        res.status(200).json({ msg: 'Venta de producto eliminada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al eliminar la venta de producto' });
    }
};

module.exports = {
    crearVentaProducto,
    obtenerVentasProductos,
    obtenerVentaProductoPorId,
    actualizarVentaProducto,
    eliminarVentaProducto
};
