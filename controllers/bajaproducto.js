const BajaProducto = require('../modules/bajaproducto');
const Insumo = require('../modules/insumo');

// Obtener todas las bajas de productos
const obtenerBajasProductos = async (req, res) => {
    try {
        const bajas = await BajaProducto.find().populate('productoId');
        res.json(bajas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las bajas de productos', error });
    }
};

// Crear una nueva baja de producto
const crearBajaProducto = async (req, res) => {
    const { productoId, fechaBaja, cantidad, observaciones } = req.body;

    try {
        const insumo = await Insumo.findById(productoId);
        if (!insumo) {
            return res.status(404).json({ message: 'Producto no encontrado en insumos' });
        }

        // Verificar si hay suficiente stock
        if (insumo.stock < cantidad) {
            return res.status(400).json({ message: 'Stock insuficiente para dar de baja' });
        }

        // Crear la baja
        const nuevaBaja = new BajaProducto({
            productoId,
            producto: insumo.nombreInsumo,
            fechaBaja,
            cantidad,
            observaciones
        });

        await nuevaBaja.save();

        // Restar cantidad del stock del insumo
        insumo.stock -= cantidad;

        // Si el stock es 0, cambiar su estado a inactivo
        if (insumo.stock === 0) {
            insumo.estado = false;
        }

        await insumo.save();

        res.status(201).json({ message: 'Baja de producto creada con éxito', baja: nuevaBaja });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la baja de producto', error });
    }
};

// Eliminar una baja de producto y restaurar el stock del insumo
const eliminarBajaProducto = async (req, res) => {
    const { id } = req.params;

    try {
        const baja = await BajaProducto.findById(id);
        if (!baja) {
            return res.status(404).json({ message: 'Baja de producto no encontrada' });
        }

        // Restaurar stock del insumo
        const insumo = await Insumo.findById(baja.productoId);
        if (insumo) {
            insumo.stock += baja.cantidad;
            insumo.estado = true; // Reactivar insumo si se eliminó la baja
            await insumo.save();
        }

        await BajaProducto.findByIdAndDelete(id);
        res.json({ message: 'Baja de producto eliminada y stock restaurado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la baja de producto', error });
    }
};

module.exports = {
    obtenerBajasProductos,
    crearBajaProducto,
    eliminarBajaProducto
};
