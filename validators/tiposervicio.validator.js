///nombreTipoServicio, activo
const Joi = require('joi');
const tiposerv = require('../modules/tiposerv');

const tipoServicioSchema = Joi.object({
    nombreTipoServicio: Joi.string()
        .trim()
        .min(3)
        .max(50)
        .required()
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
)
        .messages({
            'string.base': 'El campo nombreTipoServicio debe ser una cadena de texto con tildes y espacios.',
            'string.empty': 'El campo nombreTipoServicio no puede estar vacío.',
            'string.min': 'El campo nombreTipoServicio debe tener al menos 3 caracteres.',
            'string.max': 'El campo nombreTipoServicio no puede tener más de 50 caracteres.',
            'any.required': 'El campo nombreTipoServicio es obligatorio.'
        })
        .custom((value, helpers) => {

            // ❌ Validar que el nombre no contenga solo números
            if (/^\d+$/.test(value)) {
                return helpers.error('any.invalid', { message: 'El nombre del servicio no puede ser solo números.' });
            }
            // ❌ Validar que no sea una cadena completamente repetida
            const repeated = (str) => {
                const len = str.length;
                for (let i = 1; i <= len / 2; i++) {
                    const sub = str.slice(0, i);
                    if (sub.repeat(len / i) === str) {
                        return true;
                    }
                }
                return false;
            };

            if (repeated(value)) {
                return helpers.error('any.invalid', { message: 'El nombre del tipo de servicio no puede ser una cadena repetida.' });
            }

            return value;
        }, 'Validación personalizada'),
    activo: Joi.boolean()
        .required()
        .messages({
            'boolean.base': 'El campo activo debe ser un booleano.',
            'any.required': 'El campo activo es obligatorio.'
        })
})

module.exports = {
    tipoServicioSchema,
    tipoServicioUpdateSchema: tipoServicioSchema.fork(['nombreTipoServicio', 'activo'], (schema) => schema.optional()),
}
