const Joi = require('joi');

const registrationSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).min(3).max(50).required(),
    password: Joi.string().min(6).required(),
    repeat_password: Joi.ref('password')
})

const loginSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).min(3).max(50).required(),
    password: Joi.string().min(6).required(),
})

const updateDataSchema = Joi.object({
    name: Joi.string().min(3).max(30),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).min(3).max(50),
    current_password: Joi.string().min(6).required()
})

const changePasswordSchema = Joi.object({
    current_password: Joi.string().min(6).required(),
    new_password: Joi.string().min(6).required()
})



module.exports = { registrationSchema, loginSchema, updateDataSchema, changePasswordSchema }