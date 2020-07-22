'use strict';

const Joi = require('@hapi/joi');

function validateGetAll(req,res,next){
    const schema = Joi.object({
        search: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),

		limit: Joi.string()
            .pattern(new RegExp('^[0-9]{1,10}$')),
		offset: Joi.string()
            .pattern(new RegExp('^[0-9]{1,10}$'))
    });
    let response = schema.validate(req.query);
    console.log("response = "+response);
    if(response.error){
        console.log("Error while validating");
        res.send(response.error.details);
    }
    else{
        next();
    }
}
function validateGetWithID(req,res,next){
    const schema = Joi.object({
        id: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    });
    let response = schema.validate(req.params);
    if(response.error){
        res.send(response.error.details);
    }
    else{
        next();
    }
}
function validateCreate(req,res,next){
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
    let response = schema.validate(req.body);
    if(response.error){
        res.send(response.error.details);
    }
    else{
        next();
    }
}
function validateUpate(req,res,next){
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
    let response = schema.validate(req.body);
    if(response.error){
        res.send(response.error.details);
    }
    else{
        next();
    }
}
function validateDelete(req,res,next){
    const schema = Joi.object({
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    });
    let response = schema.validate(req.params);
    if(response.error){
        res.send(response.error.details);
    }
    else{
        next();
    }
}
function validateVerifyOTP(req,res,next){
    const schema = Joi.object({
        contact: Joi.string()
            .pattern(new RegExp('^[0-9]{7,11}$')),
        otp: Joi.string()
            .pattern(new RegExp('^[0-9]{6,6}$'))
    });
    let val = {contact: req.body.contact, otp: req.query.input};
    console.log("Inside validateVerifyOTP");
    console.log(val);
    let response = schema.validate(val);
    if(response.error){
        res.send(response.error.details);
    }
    else{
        next();
    }
}
module.exports = {
	validateGetAll: validateGetAll,
    validateGetWithID: validateGetWithID,
    validateCreate: validateCreate,
    validateUpate: validateUpate,
    validateDelete: validateDelete,
    validateVerifyOTP: validateVerifyOTP
};
