const { Schema, model } = require('mongoose');

const VentaServicioSchema = Schema({
    cliente: { 
        type: Schema.Types.ObjectId, 
        ref: 'Cliente',
        required: [true, 'El cliente es obligatorio']
    },
    cita: { 
        type: Schema.Types.ObjectId, 
        ref: 'Cita',
        required: [true, 'La cita es obligatoria']
    },
    servicios: [{
        servicio: { 
            type: Schema.Types.ObjectId, 
            ref: 'Servicio',
            required: true
        },
        nombreServicio: { 
            type: String, 
            required: true,
            trim: true
        },
        precio: { 
            type: Number, 
            required: true,
            min: 0
        },
        subtotal: { 
            type: Number, 
            required: true,
            min: 0
        },
        tiempo: { 
            type: Number, 
            required: true,
            min: 0
        } 
    }],
    precioTotal: {
        type: Number,
        required: true,
        min: 0
    },
    estado: {
        type: Boolean,
        default: true
    },
    fecha: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtuals
VentaServicioSchema.virtual('clienteNombre').get(function() {
    return this.cliente ? this.cliente.nombrecliente : 'Cliente no especificado';
});

VentaServicioSchema.virtual('citaFecha').get(function() {
    return this.cita ? this.cita.fechacita : 'Fecha no especificada';
});

module.exports = model('VentaServicio', VentaServicioSchema);
