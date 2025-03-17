// controllers/clienteController.js
const { response } = require('express');
const Cliente = require('../modules/cliente');
const Usuario = require('../modules/usuario');
const Compra = require('../modules/compra');
const Servicio = require('../modules/servicio');
const Factura = require('../modules/factura');

// Obtener datos del cliente actual o específico
const getClienteData = async (req, res = response) => {
  try {
    // El ID del cliente ya fue verificado por el middleware verificarClientePropio
    const clienteId = req.clienteId;
    
    console.log(`Obteniendo datos para cliente: ${clienteId}`);
    
    if (!clienteId) {
      return res.status(400).json({
        msg: "ID de cliente no proporcionado"
      });
    }
    
    // Obtener datos del cliente con información del usuario asociado
    const cliente = await Cliente.findById(clienteId)
      .populate({
        path: 'usuario',
        select: 'nombre apellido email correo celular estado -_id' // Excluir _id del usuario
      });
    
    if (!cliente) {
      return res.status(404).json({
        msg: "Cliente no encontrado"
      });
    }
    
    res.json({
      cliente
    });
  } catch (error) {
    console.error('Error al obtener datos del cliente:', error);
    res.status(500).json({
      msg: 'Error al obtener datos del cliente',
      error: error.message
    });
  }
};

// Obtener compras del cliente
const getClienteCompras = async (req, res = response) => {
  try {
    // El ID del cliente ya fue verificado por el middleware verificarClientePropio
    const clienteId = req.clienteId;
    
    console.log(`Obteniendo compras para cliente: ${clienteId}`);
    
    // Parámetros de paginación
    const { limit = 10, page = 1 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    // Consultar compras del cliente
    const [total, compras] = await Promise.all([
      Compra.countDocuments({ cliente: clienteId }),
      Compra.find({ cliente: clienteId })
        .populate('servicio', 'nombre descripcion precio')
        .skip(skip)
        .limit(Number(limit))
        .sort({ fecha: -1 })
    ]);
    
    console.log(`Se encontraron ${total} compras para el cliente ${clienteId}`);
    
    res.json({
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      compras
    });
  } catch (error) {
    console.error('Error al obtener compras del cliente:', error);
    res.status(500).json({
      msg: 'Error al obtener compras del cliente',
      error: error.message
    });
  }
};

// Obtener servicios contratados por el cliente
const getClienteServicios = async (req, res = response) => {
  try {
    // El ID del cliente ya fue verificado por el middleware verificarClientePropio
    const clienteId = req.clienteId;
    
    console.log(`Obteniendo servicios para cliente: ${clienteId}`);
    
    // Parámetros de paginación
    const { limit = 10, page = 1 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    // Obtener IDs de servicios contratados por el cliente
    const compras = await Compra.find({ cliente: clienteId }, 'servicio');
    const serviciosIds = [...new Set(compras.map(compra => compra.servicio))];
    
    console.log(`Servicios IDs encontrados: ${serviciosIds.length}`);
    
    // Consultar servicios
    const [total, servicios] = await Promise.all([
      Servicio.countDocuments({ _id: { $in: serviciosIds } }),
      Servicio.find({ _id: { $in: serviciosIds } })
        .skip(skip)
        .limit(Number(limit))
    ]);
    
    res.json({
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      servicios
    });
  } catch (error) {
    console.error('Error al obtener servicios del cliente:', error);
    res.status(500).json({
      msg: 'Error al obtener servicios del cliente',
      error: error.message
    });
  }
};

// Actualizar datos del cliente
const updateClienteData = async (req, res = response) => {
  try {
    // El ID del cliente ya fue verificado por el middleware verificarClientePropio
    const clienteId = req.clienteId;
    
    console.log(`Actualizando datos para cliente: ${clienteId}`);
    
    const { nombrecliente, apellidocliente, celularcliente } = req.body;
    
    // Actualizar datos del cliente
    const clienteActualizado = await Cliente.findByIdAndUpdate(
      clienteId,
      { nombrecliente, apellidocliente, celularcliente },
      { new: true }
    ).populate({
      path: 'usuario',
      select: 'nombre apellido email correo celular estado -_id'
    });
    
    // Actualizar también los datos correspondientes en el usuario
    if (clienteActualizado.usuario) {
      await Usuario.findByIdAndUpdate(
        clienteActualizado.usuario._id,
        {
          nombre: nombrecliente,
          apellido: apellidocliente,
          celular: celularcliente
        }
      );
    }
    
    res.json({
      msg: 'Datos del cliente actualizados correctamente',
      cliente: clienteActualizado
    });
  } catch (error) {
    console.error('Error al actualizar datos del cliente:', error);
    res.status(500).json({
      msg: 'Error al actualizar datos del cliente',
      error: error.message
    });
  }
};

// Obtener facturas del cliente
const getClienteFacturas = async (req, res = response) => {
  try {
    // El ID del cliente ya fue verificado por el middleware verificarClientePropio
    const clienteId = req.clienteId;
    
    console.log(`Obteniendo facturas para cliente: ${clienteId}`);
    
    // Parámetros de paginación
    const { limit = 10, page = 1 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    // Consultar facturas del cliente
    const [total, facturas] = await Promise.all([
      Factura.countDocuments({ cliente: clienteId }),
      Factura.find({ cliente: clienteId })
        .populate('compra')
        .skip(skip)
        .limit(Number(limit))
        .sort({ fecha: -1 })
    ]);
    
    console.log(`Se encontraron ${total} facturas para el cliente ${clienteId}`);
    
    res.json({
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      facturas
    });
  } catch (error) {
    console.error('Error al obtener facturas del cliente:', error);
    res.status(500).json({
      msg: 'Error al obtener facturas del cliente',
      error: error.message
    });
  }
};

// Obtener estadísticas del cliente
const getClienteStats = async (req, res = response) => {
  try {
    // El ID del cliente ya fue verificado por el middleware verificarClientePropio
    const clienteId = req.clienteId;
    
    console.log(`Obteniendo estadísticas para cliente: ${clienteId}`);
    
    // Obtener estadísticas del cliente
    const [totalCompras, serviciosActivos, facturasPendientes, citasProgramadas] = await Promise.all([
      Compra.countDocuments({ cliente: clienteId }),
      Servicio.countDocuments({ 
        _id: { 
          $in: (await Compra.find({ 
            cliente: clienteId, 
            estado: 'Activo' 
          }, 'servicio')).map(c => c.servicio) 
        } 
      }),
      Factura.countDocuments({ 
        cliente: clienteId, 
        estado: 'Pendiente' 
      }),
      Cita.countDocuments({ 
        cliente: clienteId, 
        estadocita: { $in: ['Programada', 'Confirmada'] } 
      })
    ]);
    
    res.json({
      totalCompras,
      serviciosActivos,
      facturasPendientes,
      citasProgramadas
    });
  } catch (error) {
    console.error('Error al obtener estadísticas del cliente:', error);
    res.status(500).json({
      msg: 'Error al obtener estadísticas del cliente',
      error: error.message
    });
  }
};

module.exports = {
  getClienteData,
  getClienteCompras,
  getClienteServicios,
  updateClienteData,
  getClienteFacturas,
  getClienteStats
};