const { Schema, model } = require('mongoose');

// Definir el esquema de venta de productos
const VentaProductoSchema = Schema({
    productos: [
        {
            producto: {
                type: Schema.Types.ObjectId,
                ref: 'Producto',  // Relación con el modelo de Producto
                required: true
            },
            cantidad: {
                type: Number,
                required: true
            },
            precio: {
                type: Number,
                required: true  // El precio se obtendrá del producto seleccionado
            }
        }
    ],
    nombreCliente: {
        type: Schema.Types.ObjectId,
        ref: 'Cliente',  // Relación con el modelo de Cliente
        required: true
    },
    subtotal: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    estado: {
        type: Boolean,
        default: true  // Completado o pendiente
    },
    fechaVenta: {
        type: Date,
        default: Date.now
    }
});

// Middleware para calcular el subtotal antes de guardar la venta
VentaProductoSchema.pre('save', function (next) {
    if (this.isModified('productos')) {
        this.subtotal = this.productos.reduce((acc, item) => acc + (item.cantidad * item.precio), 0);
        this.total = this.subtotal; // Cambia si deseas agregar impuestos o descuentos
    }
    next();
});

module.exports = model('VentaProducto', VentaProductoSchema);
