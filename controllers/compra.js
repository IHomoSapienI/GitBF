const Compra = require('../modules/compra');

// Crear una nueva compra
exports.crearCompra = async (req, res) => {
    try {
        const { proveedor, recibo, fechaCompra, monto, estado } = req.body;

        const nuevaCompra = new Compra({
            proveedor, // Esto es un ObjectId de un proveedor
            recibo,
            fechaCompra,
            monto,
            estado
        });

        await nuevaCompra.save();
        res.status(201).json({ mensaje: 'Compra creada exitosamente', nuevaCompra });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear la compra', error });
    }
};

// Obtener todas las compras, con la información del proveedor poblada
exports.obtenerCompras = async (req, res) => {
    try {
        const compras = await Compra.find().populate('proveedor');
        res.status(200).json(compras);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener las compras', error });
    }
};

// Obtener una compra por ID, con la información del proveedor poblada
exports.obtenerCompraPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const compra = await Compra.findById(id).populate('proveedor');
        
        if (!compra) {
            return res.status(404).json({ mensaje: 'Compra no encontrada' });
        }

        res.status(200).json(compra);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener la compra', error });
    }
};

// Actualizar una compra por ID
exports.actualizarCompra = async (req, res) => {
    try {
        const { id } = req.params;
        const { proveedor, recibo, fechaCompra, monto, estado } = req.body;

        const compraActualizada = await Compra.findByIdAndUpdate(id, {
            proveedor,
            recibo,
            fechaCompra,
            monto,
            estado
        }, { new: true });

        if (!compraActualizada) {
            return res.status(404).json({ mensaje: 'Compra no encontrada' });
        }

        res.status(200).json({ mensaje: 'Compra actualizada', compraActualizada });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar la compra', error });
    }
};

// Eliminar una compra por ID
exports.eliminarCompra = async (req, res) => {
    try {
        const { id } = req.params;
        const compraEliminada = await Compra.findByIdAndDelete(id);

        if (!compraEliminada) {
            return res.status(404).json({ mensaje: 'Compra no encontrada' });
        }

        res.status(200).json({ mensaje: 'Compra eliminada', compraEliminada });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar la compra', error });
    }
};
