const Joi = require('joi');
const { password, objectId } = require('../../validations/custom.validation');


const addPaymentHistory = {
    body: Joi.object().keys({
        // orderId: Joi.string().custom(objectId).required().messages({
        //     "any.invalid": `Order Id must be a valid object ID`,
        //     "any.required": `Order Id is a required field`
        // }),
        userId: Joi.string().custom(objectId).required().messages({
            "any.invalid": `User Id must be a valid object ID`,
            "any.required": `User Id is a required field`
        }),
        amount: Joi.number().required().messages({
            "number.base": `Amount must be a number`,
            "any.required": `Amount is a required field`
        }),
        payment_method_types: Joi.string().valid('card').required().messages({
            "any.only": `Payment method must be one of ['card']`,
            "any.required": `Payment method is a required field`
        }),
        status: Joi.string().valid('pending', 'processed', 'shipped', 'delivered', 'canceled').required().messages({
            "any.only": `Status must be one of ['pending', 'processed', 'shipped', 'delivered', 'canceled']`,
            "any.required": `Status is a required field`
        }),
    })
};





module.exports = {
    addPaymentHistory,
};
