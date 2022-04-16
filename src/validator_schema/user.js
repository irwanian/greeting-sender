const Joi = require('joi');

const schemas = {
    postCreateUser: Joi.object({
        first_name: Joi.string().required().min(1).max(100).regex(/^[a-z A-Z]+$/).error(new Error('First name must be alphabet minimum of 1 letter & maximum 100 letters')),
        last_name: Joi.string().required().min(1).max(100).regex(/^[a-z A-Z]+$/).error(new Error('Last name must be alphabet minimum of 1 letter & maximum 100 letters')),
        birth_date: Joi.date().required().iso().error(new Error('Invalid birth date format YYYY-MM-DD')),
        location: Joi.object({
            latitude: Joi.number().required().min(-90).max(90).error(new Error('Invalid latitude format')),
            longitude: Joi.number().required().min(-180).max(180).error(new Error('Invalid longitude format'))
        }).required()
    }),
    deleteUser: Joi.object({
        id: Joi.string().length(36).required().error(new Error('Invalid ID Format'))
    }),
    putUpdateUser: Joi.object({
        id: Joi.string().length(36).required().error(new Error('Invalid ID Format')),
        first_name: Joi.string().min(1).max(100).regex(/^[a-z A-Z]+$/).error(new Error('First name must be alphabet minimum of 1 letter & maximum 100 letters')),
        last_name: Joi.string().min(1).max(100).regex(/^[a-z A-Z]+$/).error(new Error('Last name must be alphabet minimum of 1 letter & maximum 100 letters')),
        birth_date: Joi.date().iso().error(new Error('Invalid birth date format YYYY-MM-DD')),
        location: Joi.object({
            latitude: Joi.number().required().min(-90).max(90).error(new Error('Invalid latitude format')),
            longitude: Joi.number().required().min(-180).max(180).error(new Error('Invalid longitude format'))
        })
    })
};

module.exports = schemas;