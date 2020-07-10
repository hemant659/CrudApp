'use strict';

const Joi = require('@hapi/joi');

function validateGetAll(user){
    const schema = Joi.object({
        search: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),

		limit: Joi.string()
            .pattern(new RegExp('^[0-9]{1,10}$')),
		offset: Joi.string()
            .pattern(new RegExp('^[0-9]{1,10}$'))
    });
    return schema.validate(user);
}
function validateGetWithID(user){
    const schema = Joi.object({
        id: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    });
    return schema.validate(user);
}
function validateCreate(user){
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(30),
        address: Joi.string()
            .min(1)
            .max(50),
        contact: Joi.string()
            .pattern(new RegExp('^[0-9]{7,11}$')),

        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })

    });
    return schema.validate(user);
}
function validateUpate(user){
    const schema = Joi.object({
        name: Joi.string()
            .min(3)
            .max(30),
        address: Joi.string()
            .min(1)
            .max(50),
        contact: Joi.string()
            .pattern(new RegExp('^[0-9]{7,11}$')),

        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })

    });
    return schema.validate(user);
}
function validateDelete(user){
    const schema = Joi.object({
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })

    });
    return schema.validate(user);
}
module.exports = {
	validateGetAll: validateGetAll,
    validateGetWithID: validateGetWithID,
    validateCreate: validateCreate,
    validateUpate: validateUpate,
    validateDelete: validateDelete
};
