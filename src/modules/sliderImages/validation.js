const Joi = require('joi');
const { password, objectId } = require('../../validations/custom.validation');


const addSliderImg = {
    body: Joi.object().keys({
        sliderImgUrl: Joi.string().required().messages({
            "string.empty": `Slider Image url must contain value`,
            "any.required": `Slider Image url is a required field`
        }),
        position:Joi.number().required().messages({
            "string.empty": `Slider Image url position must contain number`,
            "any.required": `Slider Image url position is a required field`
        })
    })
};

const updateSliderImg = {
    params: Joi.object().keys({
        id: Joi.string().custom(objectId).required().messages({
            "any.invalid": `Slider Id must be a valid object ID`,
            "any.required": `Slider Id is a required field`
        })
    }),
    body: Joi.object().keys({
        sliderImgUrl: Joi.string().required().messages({
            "string.empty": `Slider Image url must contain value`,
            "any.required": `Slider Image url is a required field`
        }),
        position:Joi.number().required().messages({
            "string.empty": `Slider Image url position must contain number`,
            "any.required": `Slider Image url position is a required field`
        }),
    })
};

const deleteSliderImg = {
    params: Joi.object().keys({
        id: Joi.string().custom(objectId).required().messages({
            "any.invalid": `Slider Id must be a valid object ID`,
            "any.required": `Slider Id is a required field`
        })
    })
};



module.exports = {
    addSliderImg,
    updateSliderImg,
    deleteSliderImg,
};
