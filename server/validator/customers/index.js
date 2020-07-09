'use strict';

const Joi = require('@hapi/joi');

function validateUser(user){
    const schema = Joi.object({
        name: Joi.string()
            .alphanum()
            .min(3)
            .max(30),

        contact: Joi.string()
            .pattern(new RegExp('^[0-9]{7,11}$')),

        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    });
    return schema.validate(user);
}
module.exports = {
	validateUser: validateUser
};
