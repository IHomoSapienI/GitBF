const Compra = require('../modules/compra');

// Obtener todas las compras
const obtenerCompras = async (req, res) => {
    try {
        const compras = await Compra.find();
        res.json(compras);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las compras', error });
    }
};

// Crear una nueva compra
const crearCompra = async (req, res) => {
    const { proveedor, recibo, fechaCompra, fechaRegistro, monto, estado } = req.body;

    try {
        const nuevaCompra = new Compra({
            proveedor,
            recibo,
            fechaCompra,
            fechaRegistro,
            monto,
            estado
        });

        await nuevaCompra.save();
        res.status(201).json({ message: 'Compra creada con éxito', compra: nuevaCompra });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la compra', error });
    }
};

// Actualizar una compra por ID
const actualizarCompra = async (req, res) => {
    const { id } = req.params;
    const { proveedor, recibo, fechaCompra, fechaRegistro, monto, estado } = req.body;

    try {
        const compraActualizada = await Compra.findByIdAndUpdate(
            id,
            { proveedor, recibo, fechaCompra, fechaRegistro, monto, estado },
            { new: true }
        );

        if (!compraActualizada) {
            return res.status(404).json({ message: 'Compra no encontrada' });
        }

        res.json({ message: 'Compra actualizada con éxito', compra: compraActualizada });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la compra', error });
    }
};

// Eliminar una compra por ID
const eliminarCompra = async (req, res) => {
    const { id } = req.params;

    try {
        const compraEliminada = await Compra.findByIdAndDelete(id);

        if (!compraEliminada) {
            return res.status(404).json({ message: 'Compra no encontrada' });
        }

        res.json({ message: 'Compra eliminada con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la compra', error });
    }
};

// Cambiar el estado de una compra por ID
const cambiarEstadoCompra = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    try {
        const compra = await Compra.findByIdAndUpdate(
            id,
            { estado },
            { new: true }
        );

        if (!compra) {
            return res.status(404).json({ message: 'Compra no encontrada' });
        }

        res.json({ message: 'Estado de la compra actualizado', compra });
    } catch (error) {
        res.status(500).json({ message: 'Error al cambiar el estado de la compra', error });
    }
};

module.exports = {
    obtenerCompras,
    crearCompra,
    actualizarCompra,
    eliminarCompra,
    cambiarEstadoCompra
};
