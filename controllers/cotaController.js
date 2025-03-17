// controllers/cotaController.js
const { response } = require('express');
const Cota = require('../modules/cota'); // Asumiendo que tienes un modelo de Cota

// Obtener todas las cotas (filtradas por cliente si es necesario)
const cotasGet = async (req, res = response) => {
  try {
    // Si existe req.filtroCliente, significa que el middleware filtrarPorUsuario
    // ha determinado que solo debe ver sus propias cotas
    const filtro = req.filtroCliente || {};
    
    // Parámetros de paginación
    const { limit = 10, page = 1 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    // Consultar cotas con filtro
    const [total, cotas] = await Promise.all([
      Cota.countDocuments(filtro),
      Cota.find(filtro)
        .populate('cliente', 'nombrecliente apellidocliente')
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 })
    ]);
    
    res.json({
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      cotas
    });
  } catch (error) {
    console.error('Error al obtener cotas:', error);
    res.status(500).json({
      msg: 'Error al obtener cotas',
      error: error.message
    });
  }
};

// Obtener una cota específica por ID
const cotaGetById = async (req, res = response) => {
  const { id } = req.params;
  
  try {
    // El middleware verificarPropietario ya verificó que el usuario tenga acceso a esta cota
    const cota = await Cota.findById(id)
      .populate('cliente', 'nombrecliente apellidocliente');
    
    if (!cota) {
      return res.status(404).json({
        msg: 'Cota no encontrada'
      });
    }
    
    res.json({ cota });
  } catch (error) {
    console.error('Error al obtener cota por ID:', error);
    res.status(500).json({
      msg: 'Error al obtener cota',
      error: error.message
    });
  }
};

// Crear una nueva cota
const cotasPost = async (req, res = response) => {
  const { descripcion, monto, fechaVencimiento } = req.body;
  
  try {
    // Si es un cliente, usar su ID (establecido por el middleware)
    const clienteId = req.clienteId;
    
    if (!clienteId) {
      return res.status(400).json({
        msg: 'Se requiere un cliente para crear una cota'
      });
    }
    
    // Crear la cota
    const cota = new Cota({
      descripcion,
      monto,
      fechaVencimiento,
      cliente: clienteId,
      estado: 'Pendiente'
    });
    
    await cota.save();
    
    res.status(201).json({
      msg: 'Cota creada correctamente',
      cota
    });
  } catch (error) {
    console.error('Error al crear cota:', error);
    res.status(500).json({
      msg: 'Error al crear cota',
      error: error.message
    });
  }
};

// Actualizar una cota
const cotasPut = async (req, res = response) => {
  const { id } = req.params;
  const { descripcion, monto, fechaVencimiento, estado } = req.body;
  
  try {
    // El middleware verificarPropietario ya verificó que el usuario tenga acceso a esta cota
    const cota = await Cota.findById(id);
    
    if (!cota) {
      return res.status(404).json({
        msg: 'Cota no encontrada'
      });
    }
    
    // Actualizar campos
    cota.descripcion = descripcion || cota.descripcion;
    cota.monto = monto || cota.monto;
    cota.fechaVencimiento = fechaVencimiento || cota.fechaVencimiento;
    cota.estado = estado || cota.estado;
    
    await cota.save();
    
    res.json({
      msg: 'Cota actualizada correctamente',
      cota
    });
  } catch (error) {
    console.error('Error al actualizar cota:', error);
    res.status(500).json({
      msg: 'Error al actualizar cota',
      error: error.message
    });
  }
};

// Eliminar una cota
const cotasDelete = async (req, res = response) => {
  const { id } = req.params;
  
  try {
    // El middleware verificarPropietario ya verificó que el usuario tenga acceso a esta cota
    const cota = await Cota.findByIdAndDelete(id);
    
    if (!cota) {
      return res.status(404).json({
        msg: 'Cota no encontrada'
      });
    }
    
    res.json({
      msg: 'Cota eliminada correctamente',
      cota
    });
  } catch (error) {
    console.error('Error al eliminar cota:', error);
    res.status(500).json({
      msg: 'Error al eliminar cota',
      error: error.message
    });
  }
};

module.exports = {
  cotasGet,
  cotaGetById,
  cotasPost,
  cotasPut,
  cotasDelete
};