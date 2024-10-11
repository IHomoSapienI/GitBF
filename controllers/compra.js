const Compra = require('../modules/compra');
const Proveedor = require('../modules/proveedor');
const Insumo = require('../modules/insumo');
const mongoose = require('mongoose');

// Crear una nueva compra
// Crear una nueva compra
exports.crearCompra = async (req, res) => {
    try {
        const { proveedor, recibo, fechaCompra, estado, insumos } = req.body;

        // Verificar que los campos requeridos estén presentes
        if (!proveedor || !recibo || !fechaCompra || !insumos) {
            return res.status(400).json({ mensaje: 'Faltan campos requeridos' });
        }

        // Verificar que el proveedor existe
        const proveedorExistente = await Proveedor.findById(proveedor);
        if (!proveedorExistente) {
            return res.status(400).json({ mensaje: 'Proveedor no encontrado' });
        }

        // Verificar que los insumos existen y obtener precios
        const insumosExistentes = await Insumo.find({ _id: { $in: insumos.map(item => item.insumo) } });
        const insumosFaltantes = insumos.filter(item => 
            !insumosExistentes.some(insumo => insumo._id.equals(item.insumo))
        );

        if (insumosFaltantes.length > 0) {
            return res.status(400).json({
                mensaje: 'Algunos insumos no fueron encontrados',
                insumosFaltantes
            });
        }

        // Calcular el monto total
        const montoTotal = insumos.reduce((total, item) => {
            const insumoEncontrado = insumosExistentes.find(insumo => insumo._id.equals(item.insumo));
            return total + (insumoEncontrado.precio * item.cantidad);
        }, 0);

        const nuevaCompra = new Compra({ 
            proveedor, 
            recibo, 
            fechaCompra, 
            fechaRegistro: new Date(), // Fecha actual para el registro
            monto: montoTotal, // Establecer el monto calculado
            estado: estado !== undefined ? estado : true, // Si no se proporciona, se establece como true por defecto
            insumos 
        });

        await nuevaCompra.save();

        return res.status(201).json(nuevaCompra);
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al crear la compra', error: error.message });
    }
};


// Obtener todas las compras
exports.obtenerCompras = async (req, res) => {
    try {
      const compra = await Compra.findById(req.params.id).populate('insumos.insumo');
      if (!compra) {
        res.status(404).json({ mensaje: 'Compra no encontrada' });
      } else {
        res.json(compra);
      }
    } catch (err) {
      res.status(500).json({ mensaje: 'Error al obtener compra' });
    }
  };

// Obtener una compra por ID
exports.obtenerCompraPorId = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ mensaje: 'ID inválido' });
        }

        const compra = await Compra.findById(req.params.id)
            .populate('proveedor', 'nombre contacto')
            .populate('insumos.insumo', 'nombreInsumo precio');

        if (!compra) {
            return res.status(404).json({ mensaje: 'Compra no encontrada' });
        }

        return res.status(200).json(compra);
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al obtener la compra', error: error.message });
    }
};

// Actualizar una compra
// Actualizar una compra
exports.actualizarCompra = async (req, res) => {
    try {
      const compra = await Compra.findById(req.params.id).populate('insumos.insumo');
      if (!compra) {
        res.status(404).json({ mensaje: 'Compra no encontrada' });
      } else {
        compra.proveedor = req.body.proveedor;
        compra.recibo = req.body.recibo;
        compra.fechaCompra = req.body.fechaCompra;
        compra.fechaRegistro = req.body.fechaRegistro;
        compra.monto = req.body.monto;
        compra.estado = req.body.estado;
        compra.insumos = req.body.insumos;
        await compra.save();
        res.json(compra);
      }
    } catch (err) {
      res.status(500).json({ mensaje: 'Error al actualizar compra' });
    }
  };


// Eliminar una compra
exports.eliminarCompra = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ mensaje: 'ID inválido' });
        }

        const compraEliminada = await Compra.findByIdAndDelete(req.params.id);
        if (!compraEliminada) {
            return res.status(404).json({ mensaje: 'Compra no encontrada' });
        }

        return res.status(200).json({ mensaje: 'Compra eliminada con éxito' });
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al eliminar la compra', error: error.message });
    }
};