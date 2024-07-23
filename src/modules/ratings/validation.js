const Joi = require('joi');
const { password, objectId } = require('../../validations/custom.validation');

const addRating = {
    body: Joi.object().keys({
        productId: Joi.string().custom(objectId).required().messages({
            "any.invalid": `Slider Id must be a valid object ID`,
            "any.required": `Slider Id is a required field`
        }),
        userId: Joi.string().custom(objectId).required().messages({
            "any.invalid": `Slider Id must be a valid object ID`,
            "any.required": `Slider Id is a required field`
        }),
        rating:Joi.number().required().messages({
            "string.empty": `Rating must contain number`,
            "any.required": `Rating is a required field`
        }),
        
    })
};

const updateRatingByUserId = {
    params: Joi.object().keys({
        id: Joi.string().custom(objectId).required().messages({
            "any.invalid": `User Id must be a valid object ID`,
            "any.required": `User Id is a required field`
        })
    }),
    body: Joi.object().keys({
        productId:  Joi.string().custom(objectId).required().messages({
            "any.invalid": `Product Id must be a valid object ID`,
            "any.required": `Product Id is a required field`
        }),
        rating:Joi.number().required().messages({
            "string.empty": `Rating must contain number`,
            "any.required": `Rating is a required field`
        }),
    })
};

const getRatingByUserId = {
    params: Joi.object().keys({
        id: Joi.string().custom(objectId).required().messages({
            "any.invalid": `User Id must be a valid object ID`,
            "any.required": `User Id is a required field`
        })
    })
};



module.exports = {
    addRating,
    updateRatingByUserId,
    getRatingByUserId
};
