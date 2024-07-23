const Joi = require('joi');
const { password, objectId } = require('../../validations/custom.validation');


const addBannerImg = {
    body: Joi.object().keys({
        bannerImgUrl: Joi.string().required().messages({
            "string.empty": `Banner Image url must contain value`,
            "any.required": `Banner Image url is a required field`
        })
    })
};

const updateBannerImg = {
    params: Joi.object().keys({
        id: Joi.string().custom(objectId).required().messages({
            "any.invalid": `Banner Id must be a valid object ID`,
            "any.required": `Banner Id is a required field`
        })
    }),
    body: Joi.object().keys({
        bannerImgUrl: Joi.string().required().messages({
            "string.empty": `Banner Image url must contain value`,
            "any.required": `Banner Image url is a required field`
        })
    })
};

const deleteBannerImg = {
    params: Joi.object().keys({
        id: Joi.string().custom(objectId).required().messages({
            "any.invalid": `Banner Id must be a valid object ID`,
            "any.required": `Banner Id is a required field`
        })
    })
};



module.exports = {
    addBannerImg,
    updateBannerImg,
    deleteBannerImg,
};
